const fs = require('fs');
const config = JSON.parse(fs.readFileSync('package.json')).gruntBuild;
const exists = require('../lib/exists');

const root = config.isSite
  ? 'src/application/'
  : 'src/';

if (config.isSite) {
  if (!exists(root + 'scripts')) {
    fs.mkdirSync(root + 'scripts');

    // Set up the folder structure for sites
    fs.mkdirSync('src/shared/');

    fs.mkdirSync(root);

    fs.mkdirSync(root + 'scripts');
    fs.mkdirSync(root + 'scripts/constants');
    fs.mkdirSync(root + 'scripts/custom');
    fs.mkdirSync(root + 'scripts/init');
    fs.mkdirSync(root + 'scripts/predicates');
    fs.mkdirSync(root + 'scripts/vendor');
    fs.mkdirSync(root + 'scripts/exports');

    fs.mkdirSync(root + 'components');
    fs.mkdirSync(root + 'containers');
  }
} else if (!config.isSite) {
  if (
    !exists(root + 'vendor/')
    && !exists(root + 'custom/')
    && !exists(root + 'constants/')
    && !exists(root + 'predicates/')
    && !exists(root + 'main/')
    && !exists(root + 'init/')
    && !exists(root + 'exports/')
  ) {
    fs.mkdirSync(root + 'vendor/');
    fs.mkdirSync(root + 'custom/');
    fs.mkdirSync(root + 'constants/');
    fs.mkdirSync(root + 'predicates/');
    fs.mkdirSync(root + 'main/');
    fs.mkdirSync(root + 'init/');
    fs.mkdirSync(root + 'exports/');
  }
}
