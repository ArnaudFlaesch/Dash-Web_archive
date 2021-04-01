pipeline {
    agent {
        docker { image 'cypress/browsers:node14.16.0-chrome89-ff77' }
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
                        sh 'yarn run eslint'
                    }
                }
            }
        }

        stage('Jest and Cypress tests') {
            parallel {
                stage('Jest') {
                    steps {
                        sh 'yarn run test -- --coverage'
                    }
                }
                stage('Cypress') {
                    steps {
                        sh 'export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket'
                        sh 'mkdir cypress/screenshots'
                        sh 'yarn run cy:verify'
                        sh 'yarn run start &'
                        sh 'yarn run cy:run'
                        sh 'yarn run report:merge'
                        sh 'yarn run report:generate'
                        sh 'yarn run report:copyScreenshots'
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
        }

        stage ('Coverage report') {
            steps {
                sh 'mkdir coverage-reports || true && mkdir .nyc_output || true'
                sh 'cp cypress-coverage/coverage-final.json coverage-reports/from-cypress.json'
                sh 'cp jest-coverage/coverage-final.json coverage-reports/from-jest.json'
                sh 'npx nyc merge coverage-reports && mv coverage.json .nyc_output/out.json'
                sh 'npx nyc report --reporter lcov --report-dir coverage'
            }
        }
    }
}
