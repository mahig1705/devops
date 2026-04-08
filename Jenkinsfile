pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t complaint-backend ./server'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh 'docker stop backend || true'
                sh 'docker rm backend || true'
            }
        }

        stage('Run New Container') {
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
    }
}