const fs = require('fs');
const path = require('path');
const padLeft = require(path.resolve('grunt/lib/padLeft'));
const padRight = require(path.resolve('grunt/lib/padRight'));
const smartCase = require(path.resolve('grunt/lib/smartCase'));

const _ = require('lodash');
const source = 'src/readme/';

function printContents(text, content, i) {
  _.forEach(content, function (value, key) {
    if (typeof value === 'object') {
      text.push(new Array(i + 2).join('#') + ' ' + smartCase(key));
    }

    if (Array.isArray(value)) {
      value.forEach(function (a) {
        let string = fs.readFileSync(a, 'utf8');
        var base = a.slice(source.length, -3).split(path.sep).map(smartCase).join(' / ');
        text.push(
          new Array(i + 3).join('#') + ' ' + base + ' \([top](#table-of-contents)\)',
          '',
          string
        );
      });
    } else if (typeof value === 'object') {
      printContents(text, value, i + 1);
    } else if (typeof value === 'string') {
      let string = fs.readFileSync(value, 'utf8');
      let name = smartCase(key);
      text.push(
        new Array(i + 2).join('#') + ' ' + name + ' \([top](#table-of-contents)\)',
        '',
        string
      );
    }
  });
}

module.exports = printContents;
