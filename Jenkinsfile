@Library("nodejs-pipeline-library") _
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
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
              nodeInstallDependencies()
            }
        }
        stage('Test') {
            steps {
              nodeTest()
            }
        }
        stage('Build') {
            steps {
              typescriptBuild()
            }
        }

    }
    post {
        always {
            cleanWs(cleanWhenNotBuilt: false,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    notFailBuild: true)
        }
    }
}
