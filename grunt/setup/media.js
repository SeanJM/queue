const fs = require('fs');
const config = JSON.parse(fs.readFileSync('package.json')).gruntBuild;

const root = config.isSite
  ? 'src/application/'
  : 'src/';

try {
  fs.statSync(root + 'images');
} catch (e) {
  fs.mkdirSync(root + 'images');
}

try {
  fs.statSync(root + 'fonts');
} catch (e) {
  fs.mkdirSync(root + 'fonts');
}
