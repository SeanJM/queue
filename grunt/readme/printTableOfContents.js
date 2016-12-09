const path = require('path');
const padLeft = require(path.resolve('grunt/lib/padLeft'));
const padRight = require(path.resolve('grunt/lib/padRight'));
const smartCase = require(path.resolve('grunt/lib/smartCase'));

const _ = require('lodash');
const source = 'src/readme/';

function toLink(s) {
  var p = s.split('/');

  p[p.length - 1] = p[p.length - 1].replace(/^_/, '');

  p = p.join('/');

  return '#' + p.toLowerCase()
    .replace(/_|\s+|\./g,'-')
    .replace(/\//g, '--') + '-top';
}

function printTableOfContents(text, content, i) {
  _.forEach(content, function (value, key) {
    if (typeof value === 'object') {
      text.push('', new Array(i).join('  ') + '- ' + smartCase(key));
    }

    if (Array.isArray(value)) {
      value.forEach(function (a) {
        let name = smartCase(path.basename(a).replace(/\.md$/, ''));
        var base = a.slice(source.length, -3);
        text.push(new Array(i + 1).join('  ') + '- [' + name + '](' + toLink(base) + ')');
      });
    } else if (typeof value === 'object') {
      printTableOfContents(text, value, i + 1);
    } else if (typeof value === 'string') {
      var base = value.substr(source.length);
      text.push(new Array(i).join('  ') + '- [' + smartCase(key) + '](' + toLink(base) + '-top)');
    }
  });
}

module.exports = printTableOfContents;
