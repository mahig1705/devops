pipeline {
    agent any

    environment {
        DOCKER_HUB     = "siddhhhhh"
        BACKEND_IMAGE  = "${DOCKER_HUB}/campus-backend:latest"
        FRONTEND_IMAGE = "${DOCKER_HUB}/campus-frontend:latest"
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
                    credentialsId: 'dockerhub-creds',   // ✅ FIXED
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

        stage('Deploy via Ansible') {
            steps {
                sh '''
                ansible-playbook -i inventory.ini deploy.yml
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                echo "Waiting for app..."
                sleep 15

                curl -f http://localhost:5000 || exit 1
                curl -f http://localhost:3000 || exit 1

                echo "✅ App is healthy"
                '''
            }
        }

        stage('DAST - OWASP ZAP') {
            steps {
                sh '''
                mkdir -p /tmp/zap
                chmod -R 777 /tmp/zap

                docker run --rm \
                --network="host" \
                -u 0 \
                -v /tmp/zap:/zap/wrk \
                zaproxy/zap-stable zap-baseline.py \
                -t http://localhost:3000 \
                -r zap_report.html \
                -I || true
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '/tmp/zap/zap_report.html', allowEmptyArchive: true
        }

        success {
            echo "✅ Pipeline completed successfully!"
        }

        failure {
            echo "❌ Pipeline failed — check logs"
        }
    }
}