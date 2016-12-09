const fs = require('fs');
const config = JSON.parse(fs.readFileSync('package.json')).gruntBuild;
const exists = require('../lib/exists');

const root = 'src/';

if (!exists('README.md')) {
  // Include an empty README
  fs.writeFileSync(
    'README.md',
    ''
  );
}

if (!exists(root + 'readme/')) {
  fs.mkdirSync(
    root + 'readme/'
  );
  if (!config.isSite) {
    fs.writeFileSync(
      root + 'readme/example.md',
      '\n<!--' +
      '\n  An brief example which showcases your plugin' +
      '\n-->'
    );
  }
}

if (!exists(root + 'readme/description.md')) {
  fs.writeFileSync(
    root + 'readme/description.md',
    '<!--' +
    '\n  Describe to the world what you toiled over. You magnificent being.' +
    '\n  (The title \'Is going to be generated\')' +
    '\n-->'
  );
}

if (!exists(root + 'readme/notes.md')) {
  fs.writeFileSync(
    root + 'readme/notes.md',
    '\n<!--' +
    '\n  Anything \'notable\' that the user should know' +
    '\n-->'
  );
}

if (!config.isSite && !exists(root + 'readme/installation.md')) {
  fs.writeFileSync(
    root + 'readme/installation.md',
    '\n<!--' +
    '\n  Installation instructions' +
    '\n-->'
  );
}
