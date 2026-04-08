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

        stage('Deploy using Ansible') {
            steps {
                sh 'ansible-playbook -i inventory deploy.yml'
            }
        }
    }
}