const path = require('path');
const fs = require('fs');

try {
  fs.statSync('.jshintrc');
} catch (e) {
  // Create a jshintrc by default
  fs.writeFileSync(
    '.eslintrc', fs.readFileSync(path.resolve('grunt/boilerplate/.eslintrc'), 'utf8')
  );
}
