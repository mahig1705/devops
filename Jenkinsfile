pipeline {
    agent any

    environment {
        DOCKER_HUB = "siddhhhhh"
        BACKEND_IMAGE = "${DOCKER_HUB}/campus-backend"
        FRONTEND_IMAGE = "${DOCKER_HUB}/campus-frontend"
    }

    triggers {
        pollSCM('* * * * *')
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/mahig1705/devops.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t $BACKEND_IMAGE ./server'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t $FRONTEND_IMAGE ./client'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',  
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                docker push $BACKEND_IMAGE
                docker push $FRONTEND_IMAGE
                '''
            }
        }

        stage('Deploy Containers') {
            steps {
                sh '''
                docker stop backend || true
                docker rm backend || true
                docker stop frontend || true
                docker rm frontend || true

                docker run -d -p 5000:5000 --name backend $BACKEND_IMAGE
                docker run -d -p 3000:3000 --name frontend $FRONTEND_IMAGE
                '''
            }
        }

        stage('DAST - OWASP ZAP') {
            steps {
                sh '''
                mkdir -p /tmp/zap
                chmod 777 /tmp/zap

                docker run --network="host" \
                -v /tmp/zap:/zap/wrk/:rw \
                zaproxy/zap-stable zap-baseline.py \
                -t http://localhost:3000 \
                -r zap_report.html
                '''
            }
        }
    }

    post {
        always {
            script {
                if (fileExists('/tmp/zap/zap_report.html')) {
                    archiveArtifacts artifacts: '/tmp/zap/zap_report.html', allowEmptyArchive: true
                }
            }
        }

        success {
            echo "✅ Pipeline Success!"
        }

        failure {
            echo "❌ Pipeline Failed!"
        }
    }
}
