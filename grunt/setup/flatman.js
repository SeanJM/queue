const fs = require('fs');
const config = JSON.parse(fs.readFileSync('package.json')).gruntBuild;

const root = config.isSite
  ? 'src/application/'
  : 'src/';

if (config.isSite) {
  try {
    fs.statSync('src/flatman');
  } catch (e) {
    fs.mkdirSync('src/flatman/');
    fs.mkdirSync('src/flatman/pages');
    fs.mkdirSync('src/flatman/components');
    fs.mkdirSync('src/flatman/content');

    fs.writeFileSync('src/flatman/pages/index.js',
      fs.readFileSync('grunt/boilerplate/flatman/index.js', 'utf8')
    );
  }
}
