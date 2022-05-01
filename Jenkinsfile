pipeline {

    agent any
    options {
        skipDefaultCheckout(true)
    }
    tools { nodejs "node" }

    environment {
        CI = 'true'
    }

    stages {

        stage('Checkout') {
            steps {
                cleanWs()
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: 'https://github.com/scheduleworm/scheduleworm.git']]
                ])
            }
        }

        stage('Install Dependencies') {
            steps {
                sh """
                echo "Installing dependencies"
                npm install
                """
            }
        }

        stage('Build') {
            steps {
                sh """
                echo "Building project"
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
      post {
        always {
            cleanWs(cleanWhenNotBuilt: false,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    notFailBuild: true,
        }
    }
}
