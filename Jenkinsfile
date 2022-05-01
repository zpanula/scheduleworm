pipeline {

    agent {
        node {
            label 'main'
        }
    }

    options {
        buildDiscarder logRotator(
                    daysToKeepStr: '16',
                    numToKeepStr: '10'
            )
    }

    stages {

        stage('Cleanup Workspace') {
            steps {
                cleanWs()
                sh """
                echo "Cleaned Up Workspace For Project"
                """
            }
        }

        stage('Code Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: 'https://github.com/scheduleworm/scheduleworm.git']]
                ])
            }
        }

        stage('Building') {
            steps {
                sh """
                npm install
                npm run build
                echo "Building project"
                """
            }
        }

        stage('Code Analysis') {
            steps {
                sh """
                npm run test
                echo "Testing code"
                """
            }
        }
    }
}
