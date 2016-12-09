const fs = require('fs');
const config = JSON.parse(fs.readFileSync('package.json')).gruntBuild;

const root = config.isSite
  ? 'src/application/'
  : 'src/';

if (config.isSite) {
  try {
    fs.statSync(root + 'styles');
  } catch (e) {
    fs.mkdirSync(root + 'styles');
    fs.mkdirSync(root + 'styles/constants');
    fs.mkdirSync(root + 'styles/custom');
    fs.mkdirSync(root + 'styles/functions');
    fs.mkdirSync(root + 'styles/placeholders');
    fs.mkdirSync(root + 'styles/vendor');
  }
}
