pipeline {
    agent any
    environment {
        DOCKER_HUB     = "siddhhhhh"
        BACKEND_IMAGE  = "${DOCKER_HUB}/campus-backend"
        FRONTEND_IMAGE = "${DOCKER_HUB}/campus-frontend"
        BACKEND_PORT   = "5000"
        FRONTEND_PORT  = "3000"
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

        stage('Deploy via Ansible') {
            steps {
                sh '''
                    ansible-playbook -i inventory.ini deploy.yml \
                        --extra-vars "backend_image=$BACKEND_IMAGE frontend_image=$FRONTEND_IMAGE"
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "⏳ Waiting for containers to start..."
                    sleep 15

                    echo "🔍 Checking backend..."
                    for i in 1 2 3 4 5; do
                        STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health || echo "000")
                        echo "  Attempt $i: HTTP $STATUS"
                        if [ "$STATUS" = "200" ] || [ "$STATUS" = "301" ] || [ "$STATUS" = "302" ]; then
                            echo "✅ Backend is healthy"
                            break
                        fi
                        if [ $i -eq 5 ]; then
                            echo "❌ Backend health check failed after 5 attempts"
                            exit 1
                        fi
                        sleep 5
                    done

                    echo "🔍 Checking frontend..."
                    for i in 1 2 3 4 5; do
                        STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
                        echo "  Attempt $i: HTTP $STATUS"
                        if [ "$STATUS" = "200" ] || [ "$STATUS" = "301" ] || [ "$STATUS" = "302" ]; then
                            echo "✅ Frontend is healthy"
                            break
                        fi
                        if [ $i -eq 5 ]; then
                            echo "❌ Frontend health check failed after 5 attempts"
                            exit 1
                        fi
                        sleep 5
                    done
                '''
            }
        }

        stage('DAST - OWASP ZAP') {
            steps {
                sh '''
                    mkdir -p /tmp/zap
                    chmod 777 /tmp/zap

                    # Run as root (-u 0) to fix the permission error on /zap/wrk/zap.yaml
                    docker run --rm \
                        --network="host" \
                        -u 0 \
                        -v /tmp/zap:/zap/wrk/:rw \
                        zaproxy/zap-stable zap-baseline.py \
                        -t http://localhost:3000 \
                        -r zap_report.html \
                        -I || true
                '''
                // -I = don't fail pipeline on ZAP alerts (informational exit)
            }
        }
    }

    post {
        always {
            script {
                if (fileExists('/tmp/zap/zap_report.html')) {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: '/tmp/zap',
                        reportFiles: 'zap_report.html',
                        reportName: 'OWASP ZAP Report'
                    ])
                    archiveArtifacts artifacts: '/tmp/zap/zap_report.html',
                                     allowEmptyArchive: true
                }
            }
        }
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed — check stage logs above"
        }
    }
}
