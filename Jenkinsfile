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
            // Este estágio cria um Pod contendo apenas o Kaniko
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
                    echo "🔨 Construindo e exportando a imagem usando Kaniko (Isolado do Nó, sem Docker Daemon)..."
                    // O Kaniko compila a imagem e exporta como arquivo tar (--no-push evita o envio para um registry externo)
                    sh '''
                      /kaniko/executor \
                        --context `pwd`/backend \
                        --dockerfile `pwd`/backend/Dockerfile \
                        --no-push \
                        --tar-Path `pwd`/${TAR_FILE} \
                        --destination ${IMAGE_NAME}:${IMAGE_TAG}
                    '''
                }
                
                echo "📦 Salvando a imagem gerada na memória do Jenkins (Stash)..."
                // O Jenkins faz o upload do arquivo tar do workspace do agente para o Controller
                stash name: 'built-image', includes: "${TAR_FILE}"
            }
        }

        stage('Security Scan (Trivy)') {
            // Este estágio cria um Pod TOTALMENTE NOVO e isolado, apenas com o Trivy
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
                // Precisamos baixar o arquivo que o estágio anterior salvou, pois este workspace é novo.
                echo "📥 Recuperando a imagem gerada (Unstash)..."
                unstash 'built-image'
                
                container('trivy') {
                    echo "🛡️ Executando análise de vulnerabilidades no arquivo tar gerado pelo Kaniko..."
                    // O Trivy lê a imagem diretamente do arquivo tar extraído
                    sh "trivy image --input ${TAR_FILE} --severity HIGH,CRITICAL --no-progress"
                }
            }
        }
    }
}
