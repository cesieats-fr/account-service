pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('DOCKER_CREDENTIALS')
    }

    stages {
        stage("Docker build") {
            steps {
                sh 'docker version'
                sh "docker build -t kilme/account-service:${BUILD_ID} ."
                sh "docker image list"
            }
        }

        stage("Push Image to Docker Hub") {
            steps {
                sh 'echo $DOCKER_CREDENTIALS_PSW | docker login -u $DOCKER_CREDENTIALS_USR --password-stdin'
                sh "docker push kilme/account-service:${BUILD_ID}"
                sh "docker rmi -f kilme/account-service:${BUILD_ID}"
            }
        }

        stage("SSH Into k8s Server") {
            steps {
                sh 'scp k8s-account-service.yml cluster@192.168.2.30:/home/cluster'
                sh "ssh cluster@192.168.2.30 'export IMAGE_VERSION=${BUILD_ID} && envsubst < k8s-account-service.yml | kubectl apply -f -'"
            }
        }

         stage("Discord Webhook") {
            steps {
                discordSend description: '', enableArtifactsList: true, footer: '', image: '', link: 'https://github.com/cesieats-fr/account-service', result: 'done', scmWebUrl: '', showChangeset: true, thumbnail: '', title: 'account-service', webhookURL: 'https://discord.com/api/webhooks/1225727451636957194/OHdKttdUjBduUFfmIloYHF4tP2IUriROjCusJBdZP0ByA83KG4Ls592Lvu6C2DCEvvNT'
            }
        }
    }
}