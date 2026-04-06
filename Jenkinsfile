pipeline {
    agent any

    environment {
        AWS_BUCKET = 'userregisteration'
        EC2_IP = '43.205.212.99'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/RakshaR28/User-Registration.git'
            }
        }

        // ================= Frontend =================
        stage('Install build Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Test build') {
            steps {
                dir('frontend') {
                    bat 'npm test -- --watchAll=false --passWithNoTests'
                }
            }
        }

        stage('Build frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy frontend to S3') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'aws-creds',
                    usernameVariable: 'AWS_ACCESS_KEY_ID',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                )]) {
                    dir('frontend') {
                        bat 'aws s3 sync build/ s3://%AWS_BUCKET% --delete'
                    }
                }
            }
        }

        // ================= Backend =================
        stage('Build User-app') {
            steps {
                dir('User-app') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Test User-app') {
            steps {
                dir('User-app') {
                    bat 'mvn test'
                }
            }
        }

        stage('Deploy User-app to EC2') {
            steps {
                withCredentials([file(credentialsId: 'ec2_cred_file', variable: 'PEM_FILE')]) {
                    bat """
                    REM Fix permissions on PEM file
                    icacls "%PEM_FILE%" /inheritance:r
                    icacls "%PEM_FILE%" /grant:r "%USERNAME%:R"

                    REM Copy JAR to EC2
                    C:\\Windows\\System32\\OpenSSH\\scp.exe -i "%PEM_FILE%" -o StrictHostKeyChecking=no User-app\\target\\*.jar ec2-user@%EC2_IP%:/home/ec2-user/app.jar

                    REM Restart app on EC2
                    C:\\Windows\\System32\\OpenSSH\\ssh.exe -i "%PEM_FILE%" -o StrictHostKeyChecking=no ec2-user@%EC2_IP% "pkill -f app.jar || true && nohup java -jar /home/ec2-user/app.jar > app.log 2>&1 &"
                    """
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
