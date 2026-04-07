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
        stage('Install Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm test -- --watchAll=false --passWithNoTests'
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
        stage('Build Backend') {
            steps {
                dir('User-app') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('User-app') {
                    bat 'mvn test'
                }
            }
        }

        stage('Deploy Backend to EC2') {
            steps {
                withCredentials([file(credentialsId: 'ec2_cred_file', variable: 'PEM_FILE')]) {
                    bat """
                    REM Fix PEM permissions (IMPORTANT)
                    icacls "%PEM_FILE%" /inheritance:r
                    icacls "%PEM_FILE%" /grant:r %USERNAME%:R

                    REM Copy JAR (use explicit jar name if possible)
                    C:\\Windows\\System32\\OpenSSH\\scp.exe -i "%PEM_FILE%" -o StrictHostKeyChecking=no User-app\\target\\*.jar ec2-user@%EC2_IP%:/home/ec2-user/app.jar

                    REM Stop existing app (safe)
                    C:\\Windows\\System32\\OpenSSH\\ssh.exe -i "%PEM_FILE%" -o StrictHostKeyChecking=no ec2-user@%EC2_IP% "pkill -f app.jar || true"

                    REM Start new app
                    C:\\Windows\\System32\\OpenSSH\\ssh.exe -i "%PEM_FILE%" -o StrictHostKeyChecking=no ec2-user@%EC2_IP% "nohup java -jar /home/ec2-user/app.jar > app.log 2>&1 &"

                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                withCredentials([file(credentialsId: 'ec2_cred_file', variable: 'PEM_FILE')]) {
                    bat """
                    REM Wait for app to start
                    timeout /t 10

                    REM Check if app is responding
                    C:\\Windows\\System32\\OpenSSH\\ssh.exe -i "%PEM_FILE%" -o StrictHostKeyChecking=no ec2-user@%EC2_IP% "curl -s http://localhost:8080/users || echo APP_NOT_RUNNING"
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful! App restarted on EC2.'
        }
        failure {
            echo '❌ Pipeline Failed! Check logs.'
        }
    }
}
