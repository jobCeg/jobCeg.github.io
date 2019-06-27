const { defaults } = require('jest-config');
module.exports = {
  preset: 'jest-puppeteer',
  testRegex: '\\.spec\\.js$',
  moduleFileExtensions: [...defaults.moduleFileExtensions]
};
