const path = require('path');
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json'));
const config = pkg.gruntBuild;
const generate = require('./generate');

const exists = require('../lib/exists');

function task(callback) {
  try {

    if (config.isProduction && exists('test/index.js')) {
      let tinyTest = require(path.resolve('test/'));

      tinyTest.silence();

      tinyTest.then(function (test_results) {
        try {
          generate(test_results, callback);
        } catch(e) {
          console.trace(e);
        }
      });

    } else {
      generate(undefined, callback);
    }
  } catch(e) {
    console.trace(e);
  }
}

module.exports = {
  glob : ['src/readme/**/*.md'],
  task : task
};
