
pipeline {
    agent any

    environment {
        AWS_BUCKET = 'your-s3-bucket-name'
        EC2_IP = 'your-ec2-public-ip'
        SSH_CRED = 'ec2-key'
        AWS_CRED = 'aws-creds'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/your-repo.git'
            }
        }

        // ================= FRONTEND =================
        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm test -- --watchAll=false'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy Frontend to S3') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-creds', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    dir('frontend') {
                        sh '''
                        aws s3 sync build/ s3://$AWS_BUCKET --delete
                        '''
                    }
                }
            }
        }

        // ================= BACKEND =================
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    sh 'mvn test'
                }
            }
        }

        stage('Deploy Backend to EC2') {
            steps {
                sshagent(credentials: ['ec2-key']) {
                    sh '''
                    scp -o StrictHostKeyChecking=no backend/target/*.jar ec2-user@$EC2_IP:/home/ec2-user/app.jar

                    ssh -o StrictHostKeyChecking=no ec2-user@$EC2_IP "
                        pkill -f app.jar || true
                        nohup java -jar /home/ec2-user/app.jar > app.log 2>&1 &
                    "
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
