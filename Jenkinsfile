pipeline {
    agent any
    stages {
        stage('Pre test') {
            sh 'docker pull arnaudf93/dashwebservices:latest'
            sh 'docker run -d -p 8080:8080  arnaudf93/dashwebservices'
        }
        stage('Test project') {
            agent {
                docker { image 'cypress/browsers:node14.16.0-chrome89-ff86' }
            }
            stages {
                stage('Build') {
                    steps {
                        sh 'yarn install --frozen-lockfile'
                        sh 'yarn add global wait-on'
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

                stage('Jest and Cypress tests') {
                    parallel {
                        stage('Jest') {
                            steps {
                                sh 'npm run test -- --coverage'
                            }
                        }
                        stage('Cypress') {
                            steps {
                                sh 'mkdir cypress/screenshots'
                                sh 'npm run cy:verify'
                                sh 'npm run start &'
                                sh 'npm run cy:run'
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
                sh 'npm run report:merge'
                sh 'npm run report:generate'
                sh 'npm run report:copyScreenshots'
                publishHTML target: [
                    allowMissing         : false,
                    alwaysLinkToLastBuild: false,
                    keepAll              : true,
                    reportDir            : 'cypress/reports/html',
                    reportFiles          : 'tests-report.html',
                    reportName           : 'Cypress report'
                ]
        }
    }
}
