const fs = require('fs');
const config = JSON.parse(fs.readFileSync('package.json')).gruntBuild;

try {
  fs.statSync('src/');
} catch (e) {
  fs.mkdirSync('src/');
  require('./media');
}

if (config.isSite) {
  try {
    fs.statSync('src/application/');
  } catch (e) {
    fs.mkdirSync('src/application/');
  }
}

require('./readme');
require('./gitignore');
require('./eslintrc');
require('./tests');
require('./scripts');
require('./styles');
require('./flatman');
