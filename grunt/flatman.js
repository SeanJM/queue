const path = require('path');
const m = require('match-file-utility');
const exists = require(path.resolve('grunt/lib/exists'));

let files = m('src/flatman/', /\.js$/);

module.exports = {
  glob : [
    'src/flatman/**/*.js',
    'src/flatman/**/*.txt',
    'src/flatman/**/*.md'
  ],

  files : files,

  task : function (callback) {
    const path = require('path');
    if (exists('src/flatman')) {
      try {
        let index = require(path.resolve('src/flatman/index.js'));
        index({
          scripts : require('./scripts'),
          css : require('./css')
        });
      } catch (e) {
        console.log(e.stack);
      }
    }
    callback();
  }
};
