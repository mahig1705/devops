pipeline {
    agent any

    stages {

        stage('Build Backend') {
            steps {
                sh 'docker build -t complaint-backend ./server'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'docker build -t complaint-frontend ./client'
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh 'docker stop backend || true'
                sh 'docker rm backend || true'
                sh 'docker stop frontend || true'
                sh 'docker rm frontend || true'
            }
        }

        stage('Run Backend') {
            steps {
                sh '''
                docker run -d \
                -p 5000:5000 \
                --name backend \
                -e MONGO_URI="mongodb+srv://mahig1705:Mahi%401705@cluster0.nfeadj3.mongodb.net/campus?retryWrites=true&w=majority" \
                complaint-backend
                '''
            }
        }

        stage('Run Frontend') {
            steps {
                sh '''
                docker run -d \
                -p 3000:80 \
                --name frontend \
                complaint-frontend
                '''
            }
        }
    }
}