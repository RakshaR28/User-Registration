pipeline {
    agent any

    environment {
        AWS_BUCKET = 'user-app-ui-313117918352-ap-south-2-an'
        EC2_IP = '18.61.201.138'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/RakshaR28/User-Registration.git'
            }
        }

        // ================= FRONTEND =================
        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm test -- --watchAll=false'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy Frontend to S3') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'aws-creds',
                    usernameVariable: 'AKIAURZ2IISIPEXTLW6F',
                    passwordVariable: 'jur0EdpxBZZ7PV0LnqkDqy5lPv6qeQ8tl2DL41YQ'
                )]) {
                    dir('frontend') {
                        bat 'aws s3 sync build/ s3://%AWS_BUCKET% --delete'
                    }
                }
            }
        }

        // ================= BACKEND =================
        stage('Build Backend') {
            steps {
                dir('backend') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    bat 'mvn test'
                }
            }
        }

        stage('Deploy Backend to EC2') {
            steps {
                sshagent(['ec2-key']) {
                    bat '''
                    scp -o StrictHostKeyChecking=no backend\\target\\*.jar ec2-user@%EC2_IP%:/home/ec2-user/app.jar

                    ssh -o StrictHostKeyChecking=no ec2-user@%EC2_IP% ^
                    "pkill -f app.jar || true && nohup java -jar /home/ec2-user/app.jar > app.log 2>&1 &"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful!'
        }
        failure {
            echo 'Pipeline Failed!'
        }
    }
}
