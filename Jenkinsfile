pipeline {
    agent any

    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t complaint-backend ./server'
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
