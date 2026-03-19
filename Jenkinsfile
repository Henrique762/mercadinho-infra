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
                    sh "trivy image --input ${TAR_FILE} --severity HIGH,CRITICAL --exit-code 1 --no-progress"
                }
            }
        }
    }
}
