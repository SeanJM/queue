const path = require('path');

const requireResolve = function (string) { return require(path.resolve(string)); };
const page = require('flatman').page;
const el = require('flatman').el;

let index = page('index.html');

index
  .title('Title')
  .body(
    el()
  );

module.exports = index;
