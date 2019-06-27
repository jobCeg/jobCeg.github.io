const { defaults } = require('jest-config');
module.exports = {
  collectCoverage: true,
  coverageDirectory:  'coverage',
  testRegex: '\\.test\\.js$',
  moduleFileExtensions: [...defaults.moduleFileExtensions]
};
