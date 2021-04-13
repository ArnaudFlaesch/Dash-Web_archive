pipeline {
    agent any
    stages {
        stage('Pull and start backend application') {
            steps {
                sh 'docker compose up -d'
            }
        }
        stage('Frontend tests') {
            agent {
                docker { image 'cypress/browsers:node14.16.0-chrome89-ff86' }
            }
            stages {
                stage('Install dependencies') {
                    steps {
                        sh 'yarn install --frozen-lockfile'
                        sh 'yarn add global wait-on snyk snyk-to-html'
                    }
                }

                stage('Lint') {
                    parallel {
                        stage('Lint SCSS files') {
                            steps {
                                sh 'npm run lint:styles:report'
                            }
                        }
                        stage('Lint JS/TS files') {
                            steps {
                                sh 'npm run eslint'
                            }
                        }
                    }
                }

                stage('Snyk dependencies report') {
                    steps {
                        script {
                            if( "${env.BRANCH_NAME}" == "master" ) {
                                // sh 'snyk auth env var SNYK_TOKEN'
                                sh 'snyk test --json-file-output=snyk-report.json'
                                sh 'snyk-to-html -i snyk-report.json -o snyk-report.html'
                            }
                        }
                    }
                }

                stage('Tests') {
                    parallel {
                        stage('Jest components tests') {
                            steps {
                                sh 'npm run test:coverage'
                            }
                        }
                        stage('Cypress e2e tests') {
                            steps {
                                sh 'mkdir cypress/screenshots'
                                sh 'npm run cy:verify'
                                sh 'npm run start &'
                                sh 'npm run cy:run:ci'
                            }
                        }
                    }
                }
            }
        }
    }
    post {
        success {
            sh 'mkdir coverage-reports || true && mkdir .nyc_output || true'
            sh 'cp cypress-coverage/coverage-final.json coverage-reports/from-cypress.json'
            sh 'cp jest-coverage/coverage-final.json coverage-reports/from-jest.json'
            sh 'npx nyc merge coverage-reports && mv coverage.json .nyc_output/out.json'
            sh 'npx nyc report --reporter lcov --report-dir coverage'
        }
        always {
            sh 'docker stop dash-webservices'
            sh 'npm run report:merge'
            sh 'npm run report:generate'
            sh 'npm run report:copyScreenshots'
            publishHTML target: [
                allowMissing         : false,
                alwaysLinkToLastBuild: true,
                keepAll              : true,
                reportDir            : 'cypress/reports/html',
                reportFiles          : 'tests-report.html',
                reportName           : 'Cypress report'
            ]
            script {
                if( "${env.BRANCH_NAME}" == "master" ) {
                    publishHTML target: [
                        allowMissing         : false,
                        alwaysLinkToLastBuild: false,
                        keepAll              : true,
                        reportDir            : '.',
                        reportFiles          : 'snyk-report.html',
                        reportName           : 'Snyk report'
                    ]
                }
            }
        }
    }
}
