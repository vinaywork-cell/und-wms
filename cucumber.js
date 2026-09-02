module.exports = {
  default: {
    paths: ['src/features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: ['src/steps/**/*.ts'],
    format: [
      'progress-bar',
      'summary',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true
  },
  login: {
    paths: ['src/features/login.feature'],
    requireModule: ['ts-node/register'],
    require: ['src/steps/**/*.ts'],
    format: ['progress', 'html:reports/login-report.html']
  },
  inbound: {
    paths: ['src/features/inbound.feature'],
    requireModule: ['ts-node/register'],
    require: ['src/steps/**/*.ts'],
    format: ['progress', 'html:reports/inbound-report.html']
  }
};
