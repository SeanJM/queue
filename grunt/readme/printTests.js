const path = require('path');
const padLeft = require(path.resolve('grunt/lib/padLeft'));
const padRight = require(path.resolve('grunt/lib/padRight'));
const typeToString = require(path.resolve('grunt/tinyTest/utilities/typeToString'));

module.exports = function (text, test_results) {
  text.push('***', '', '## Tests');

  text.push('', '```');

  for (var k in test_results.passed) {
    text.push(
      padLeft(test_results.passed[k].index, 5, ' ') + '. ' + padRight(test_results.passed[k].name, 68, '.') + ' ✅'
    );
  }

  for (k in test_results.failed) {
    text.push(
      '\n' + padLeft(test_results.failed[k].index, 5, ' ') + '. ' + padRight(test_results.failed[k].name + ' ', 68, '.') + ' 🚫'
    );

    if (test_results.failed[k].isCaught[0] || test_results.failed[k].isCaught[1]) {
      if (test_results.failed[k].isCaught[0]) {
        text.push(
          '      ' + test_results.failed[k].a.toString()
        );
      }
      if (test_results.failed[k].isCaught[1]) {
        text.push(
          '      ' + test_results.failed[k].b.toString()
        );
      }
    } else {
      text.push(
        '\n +' + '   Left: ' + padLeft(typeToString(test_results.failed[k].b), 66, ' ') +
        '\n -' + '  Right: ' + padLeft(typeToString(test_results.failed[k].a), 66, ' ')
      );
    }
  }

  text.push('```', '');
};
