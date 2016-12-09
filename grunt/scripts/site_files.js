const path = require('path');
const fs = require('fs');
const m = require('match-file-utility');
const config = JSON.parse(fs.readFileSync('package.json')).gruntBuild;

function notGrunt(file) {
  return !/Gruntfile.js$/.test(file);
}

function vendorSort(a, b) {
  if (/lodash|underscore/.test(a)) {
    return -1;
  } else if (a > b) {
    return -1;
  } else if (a < b) {
    return 1;
  }
  return 0;
}

let src = {
  vendor : m('src/application/scripts/vendor/', /\.js$/).filter(notGrunt).sort(vendorSort),
  shared : m('src/shared/', /\.js$/).filter(notGrunt),
  constants : m('src/application/scripts/constants/', /\.js$/).filter(notGrunt),
  predicates : m('src/application/scripts/predicates/', /\.js$/).filter(notGrunt),
  custom : m('src/application/scripts/custom/', /\.js$/).filter(notGrunt),
  components : m('src/application/components/', /\.js$/).filter(notGrunt),
  containers : m('src/application/containers/', /\.js$/).filter(notGrunt),
  collections : m('src/application/collections/', /\.js$/).filter(notGrunt),
  main : m('src/application/scripts/main/', /\.js$/).filter(notGrunt),
  init : m('src/application/scripts/init/', /\.js$/).filter(notGrunt),
  exports : m('src/application/scripts/exports/', /\.js$/).filter(notGrunt)
};

let dest = {
  development : {},
  production : {
    bundle : config.scripts && config.bundle
      ? config.bundle
      : 'bin/bundle.js'
  }
};

if (config.isBundle) {
  dest.development.bundle = dest.production.bundle;
} else {
  for (var k in src) {
    if (src[k].length) {
      dest.development[k] = 'bin/' + k + '.js';
    }
  }
}

module.exports = {
  src : src,
  dest : dest,

  list : [].concat(
    src.vendor,
    src.shared,
    src.constants,
    src.predicates,
    src.custom,
    src.components,
    src.containers,
    src.collections,
    src.main,
    src.init,
    src.exports
  )
};
