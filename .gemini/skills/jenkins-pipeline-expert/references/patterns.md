# Jenkins Pipeline Patterns

## 1. Kubernetes Pod Template (Standard)
Padrão para rodar agentes Jenkins dentro do Kubernetes com suporte a múltiplos containers.

```groovy
pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:24-bookworm
    command: ["sleep"]
    args: ["9999999"]
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command: ["sleep"]
    args: ["9999999"]
"""
        }
    }
    stages {
        stage('Example') {
            steps {
                container('node') {
                    sh 'node -v'
                }
            }
        }
    }
}
```

## 2. Kaniko Build & Push (No Docker-in-Docker)
Essencial para ambientes Kubernetes onde o acesso ao Docker Socket é restrito.

```groovy
stage('Build & Push') {
    steps {
        withCredentials([usernamePassword(credentialsId: 'registry-creds', passwordVariable: 'REG_PASS', usernameVariable: 'REG_USER')]) {
            container('kaniko') {
                sh """
                mkdir -p /kaniko/.docker
                echo "{\\"auths\\":{\\"registry.local\\":{\\"auth\\":\\"`echo -n ${REG_USER}:${REG_PASS} | base64 | tr -d '\\n'`\\"}}}" > /kaniko/.docker/config.json
                /kaniko/executor --context `pwd` --dockerfile `pwd`/Dockerfile --destination registry.local/my-image:${env.BUILD_NUMBER} --skip-tls-verify
                """
            }
        }
    }
}
```

## 3. Stash/Unstash (Passagem de Artefatos)
Utilizado para passar arquivos entre diferentes agentes/pods de forma eficiente.

```groovy
// No estágio de Build
stash name: 'dist', includes: 'build/**'

// No estágio de Deploy
unstash 'dist'
```

## 4. Segurança com Trivy
Análise de vulnerabilidades em imagens.

```groovy
stage('Scan') {
    steps {
        container('trivy') {
            sh "trivy image --severity HIGH,CRITICAL --exit-code 1 registry.local/my-image:${env.BUILD_NUMBER}"
        }
    }
}
```
