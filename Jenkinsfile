pipeline {
    agent {
        docker { image 'node:15.12.0' }
    }
    stages {
        stage('Build') {
            steps {
                sh 'yarn install --frozen-lockfile'
				sh 'apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb'
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
            steps {
                sh 'yarn run cy:verify'
                sh 'mkdir cypress/screenshots'
                sh 'yarn run ci'

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
