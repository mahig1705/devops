pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "mahi170526"
        BACKEND_IMAGE = "mahi170526/complaint-backend:latest"
        FRONTEND_IMAGE = "mahi170526/complaint-frontend:latest"
    }

    stages {

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t complaint-backend ./server'
                sh 'docker tag complaint-backend $BACKEND_IMAGE'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t complaint-frontend ./client'
                sh 'docker tag complaint-frontend $FRONTEND_IMAGE'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {
                    sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                sh 'docker push $BACKEND_IMAGE'
                sh 'docker push $FRONTEND_IMAGE'
            }
        }

        stage('Deploy') {
            steps {
                sh 'ansible-playbook -i inventory deploy.yml'
            }
        }
    }
}