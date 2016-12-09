const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const m = require('match-file-utility');

const pkg = JSON.parse(fs.readFileSync('package.json'));

const linkLicense = require('./linkLicense');
const exists = require('../lib/exists');
const padLeft = require(path.resolve('grunt/lib/padLeft'));
const padRight = require(path.resolve('grunt/lib/padRight'));
const smartCase = require(path.resolve('grunt/lib/smartCase'));
const printTests = require('./printTests');
const printTableOfContents = require('./printTableOfContents');
const printContents = require('./printContents');

const source = 'src/readme/';

function generate(test_results, callback) {
  let content = {};
  let text = [];
  var hasTests = test_results && test_results.int_total > 0;

  m(source, /\.md$/)
    .forEach(function (a) {
      var p = a.substr(source.length).split(path.sep);
      var s = p.slice(0, -1);

      if (s.length) {
        if (typeof _.get(content, s) === 'undefined') {
          _.set(content, s, []);
        } else if (typeof _.get(content, s) === 'string') {
          throw new Error('Invalid folder structure for "' + s.join(path.sep) + '"');
        }
        _.get(content, s).push(a);
      } else {
        content[ p[0].replace(/\.md$/, '') ] = a;
      }
    });


  text.push('# ' + smartCase(pkg.name) + ' ' + pkg.version);

  text.push('#### License: ' + linkLicense(pkg.license || 'MIT'));

  text.push('');

  if (hasTests) {
    if (test_results.int_passed === test_results.int_total) {
      text.push('#### ✅ All ' + test_results.int_total + ' tests pass');
    } else {
      text.push('#### 🚫 ' + test_results.int_passed + ' of ' + test_results.int_total + ' tests passed (' + Math.round((test_results.int_passed / test_results.int_total) * 100) + '%)');
    }
  } else {
    text.push('#### 🐛 No unit tests');
  }

  text.push('', '## Table of Contents');

  text.push('', '#### Overview', '');

  printTableOfContents(text, content, 1);

  if (hasTests) {
    text.push('- [Tests](#tests)');
  }

  text.push('');

  printContents(text, content, 1);

  if (hasTests) {
    printTests(text, test_results);
  }

  fs.writeFileSync('README.md', text.join('\n'));
  callback();
}

module.exports = generate;
