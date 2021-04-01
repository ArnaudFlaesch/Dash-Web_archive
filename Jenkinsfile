pipeline {
    
    stages {
	agent {
        docker { image 'node:15.12.0' }
    }
        stage('Build') {
            steps {
                sh 'yarn install --frozen-lockfile'
            }
        }

        stage('Lint') {
		
            parallel {
                stage('Lint SCSS files') {
				agent {
        docker { image 'node:15.12.0' }
    }
                    steps {
                        sh 'npm run lint:styles:report'
                    }
                }
                stage('Lint JS/TS files') {
				agent {
        docker { image 'node:15.12.0' }
    }
                    steps {
                        sh 'yarn run eslint'
                    }
                }
            }
        }

        stage('Jest and Cypress tests') {
		agent {
			docker { image 'cypress/base:10' }
		}
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
