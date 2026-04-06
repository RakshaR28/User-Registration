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

        // ================= build =================
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

        stage('Build build') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy build to S3') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'aws-creds',
                    usernameVariable: 'AWS_ACCESS_KEY_ID',
                    passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                )]) {
                    dir('frontend') {
                        bat 'aws s3 sync build/ s3://user-app-ui-313117918352-ap-south-2-an --delete'
                    }
                }
            }
        }

        // ================= User-app =================
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
                sshagent(['ec2-key']) {
                  bat '''
scp -i C:/Users/rmvja/Downloads/user-registerkey.pem -o StrictHostKeyChecking=no User-app/target/*.jar ec2-user@18.61.201.138:/home/ec2-user/app.jar

ssh -i C:/Users/rmvja/Downloads/user-registerkey.pem -o StrictHostKeyChecking=no ec2-user@18.61.201.138 ^
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
/*pipeline {
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
                dir('frontend') {   // FIXED
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

        // ================= User-app =================
        stage('Build User-app') {
            steps {
                dir('User-app') {   // FIXED (ensure folder name matches repo)
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
    }

    post {
        success {
            echo 'CI SUCCESS: Build & Tests Passed'
        }
        failure {
            echo 'CI FAILED: Check logs'
        }
    }
}*/
