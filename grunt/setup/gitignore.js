const fs = require('fs');
const exists = require('../lib/exists');

if (!exists('.gitignore')) {
  // Create a gitingore by default
  fs.writeFileSync(
    '.gitignore',
    [
      'node_modules',
      '.DS_STORE',
      '.sass-cache'
    ].join('\n')
  );
}
