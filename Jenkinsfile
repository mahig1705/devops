pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git 'YOUR_REPO_URL'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t complaint-backend .'
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker stop backend || true'
                sh 'docker rm backend || true'
                sh 'docker run -d -p 5000:5000 --name backend complaint-backend'
            }
        }
    }
}
