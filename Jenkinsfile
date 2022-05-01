pipeline {

    agent any
    tools { nodejs "node" }

    environment {
        CI = 'true'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: 'https://github.com/scheduleworm/scheduleworm.git']]
                ])
            }
        }

        stage('Build') {
            steps {
                sh """
                echo "Building project"
                npm install
                npm run build
                """
            }
        }

        stage('Test') {
            steps {
                sh """
                echo "Testing code"
                npm run test
                """
            }
        }
    }
}
