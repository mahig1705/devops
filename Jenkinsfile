pipeline {
    agent any

    environment {
        MONGO_URI = 'mongodb+srv://mahig1705:Mahi%401705@cluster0.nfeadj3.mongodb.net/campus?retryWrites=true&w=majority'
    }

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
                sh '''
                docker run -d -p 5000:5000 \
                -e MONGO_URI=$MONGO_URI \
                --name backend complaint-backend
                '''
            }
        }
    }
}
