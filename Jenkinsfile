pipeline {
    agent any

    environment {
        DOCKER_HUB     = "siddhhhhh"
        BACKEND_IMAGE  = "${DOCKER_HUB}/campus-backend:latest"
        FRONTEND_IMAGE = "${DOCKER_HUB}/campus-frontend:latest"
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/mahig1705/devops.git'
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                docker build -t $BACKEND_IMAGE ./server
                docker build -t $FRONTEND_IMAGE ./client
                '''
            }
        }

        stage('Docker Login & Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh '''
                    echo $PASS | docker login -u $USER --password-stdin
                    docker push $BACKEND_IMAGE
                    docker push $FRONTEND_IMAGE
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'ansible-playbook -i inventory.ini deploy.yml'
            }
        }

    }
}