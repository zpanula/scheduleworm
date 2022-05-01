pipeline {

    agent {
        docker {
          image 'node:16'
          args '-p 3000:3000'
      }
    }

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
                npm install
                npm run build
                echo "Building project"
                """
            }
        }

        stage('Test') {
            steps {
                sh """
                npm run test
                echo "Testing code"
                """
            }
        }
    }
}
