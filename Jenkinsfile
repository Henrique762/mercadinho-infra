pipeline {
    // Retiramos o agente global. Cada estágio definirá seu próprio Pod isolado.
    agent none 
    
    environment {
        // Apontamento para o projeto padrão 'library' no seu Harbor local
        HARBOR_REGISTRY = "harbor.henrique.local/library"
        IMAGE_NAME = "mercadinho-flask-api"
        IMAGE_TAG = "ci-build"
        FULL_IMAGE = "${HARBOR_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
    }

    stages {
        stage('Build & Push Image (Kaniko)') {
            agent {
                kubernetes {
                    yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command:
    - sleep
    args:
    - 9999999
'''
                }
            }
            steps {
                // Traz o código para o workspace deste agente
                checkout scm
                
                // Exige a criação prévia de uma credencial no Jenkins do tipo 'Username with password' com o ID 'harbor-creds'
                withCredentials([usernamePassword(credentialsId: 'harbor-creds', passwordVariable: 'HARBOR_PASSWORD', usernameVariable: 'HARBOR_USERNAME')]) {
                    container('kaniko') {
                        echo "🔨 Construindo e enviando a imagem para o Harbor via Kaniko..."
                        
                        // Configura a autenticação do Harbor injetando no arquivo config.json do Kaniko
                        sh '''
                          mkdir -p /kaniko/.docker
                          echo "{\\"auths\\":{\\"harbor.henrique.local\\":{\\"auth\\":\\"`echo -n ${HARBOR_USERNAME}:${HARBOR_PASSWORD} | base64 | tr -d '\\n'`\\"}}}" > /kaniko/.docker/config.json
                          
                          /kaniko/executor \
                            --context `pwd`/backend \
                            --dockerfile `pwd`/backend/Dockerfile \
                            --destination ${FULL_IMAGE} \
                            --skip-tls-verify
                        '''
                    }
                }
            }
        }

        stage('Security Scan (Trivy)') {
            agent {
                kubernetes {
                    yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: trivy
    image: aquasec/trivy:latest
    command:
    - cat
    tty: true
'''
                }
            }
            steps {
                // O Trivy lê automaticamente as variáveis TRIVY_USERNAME e TRIVY_PASSWORD para autenticação
                withCredentials([usernamePassword(credentialsId: 'harbor-creds', passwordVariable: 'TRIVY_PASSWORD', usernameVariable: 'TRIVY_USERNAME')]) {
                    container('trivy') {
                        echo "🛡️ Executando análise de vulnerabilidades diretamente no Harbor..."
                        // A flag --insecure é usada porque o certificado do cluster local é autoassinado
                        sh """
                          trivy image --insecure --severity HIGH,CRITICAL --exit-code 1 --no-progress ${FULL_IMAGE}
                        """
                    }
                }
            }
        }
    }
}
