pipeline {
    // Retiramos o agente global. Cada estágio definirá seu próprio Pod isolado.
    agent none 
    
    environment {
        IMAGE_NAME = "mercadinho-flask-api"
        IMAGE_TAG = "ci-build"
        TAR_FILE = "mercadinho-api-image.tar"
    }

    stages {
        stage('Build Image (Kaniko)') {
            // Condição: Só rode este estágio SE houver commits na pasta "backend/".
            // Acionado via Webhook.
            when {
                changeset "backend/**"
            }
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
                
                container('kaniko') {
                    echo "🔨 Alterações no backend detectadas! Construindo a imagem via Kaniko..."
                    // O Kaniko compila a imagem e exporta como arquivo tar
                    sh '''
                      /kaniko/executor \
                        --context `pwd`/backend \
                        --dockerfile `pwd`/backend/Dockerfile \
                        --no-push \
                        --tar-path `pwd`/${TAR_FILE} \
                        --destination ${IMAGE_NAME}:${IMAGE_TAG}
                    '''
                }
                
                echo "📦 Salvando a imagem gerada na memória do Jenkins (Stash)..."
                stash name: 'built-image', includes: "${TAR_FILE}"
            }
        }

        stage('Security Scan (Trivy)') {
            // Este estágio também só roda se o backend sofreu alterações
            when {
                changeset "backend/**"
            }
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
                echo "📥 Recuperando a imagem gerada (Unstash)..."
                unstash 'built-image'
                
                container('trivy') {
                    echo "🛡️ Executando análise de vulnerabilidades no arquivo tar..."
                    sh "trivy image --input ${TAR_FILE} --severity HIGH,CRITICAL --no-progress"
                }
            }
        }
        
        stage('Skip Message') {
            // Estágio apenas para log visual caso o webhook dispare por conta 
            // de alterações em outras pastas (ex: frontend/ ou k8s/)
            when {
                not {
                    changeset "backend/**"
                }
            }
            steps {
                echo "⏭️ Nenhuma alteração detectada no diretório 'backend/'. Pulando o build da API."
            }
        }
    }
}
