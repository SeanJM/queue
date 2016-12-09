const fs = require('fs');

try {
  fs.statSync('test/');
} catch (e) {
  // Include an empty boilerplate test file (these comments are almost unnecessary)
  fs.mkdirSync('test/');
    fs.writeFileSync(
      'test/index.js',
      fs.readFileSync('grunt/boilerplate/tinyTest.js', 'utf8')
    );
}
