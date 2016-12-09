const fs = require('fs');
const m = require('match-file-utility');
const config = JSON.parse(fs.readFileSync('package.json')).gruntBuild;

function notGrunt(file) {
  return !/Gruntfile.js$/.test(file);
}

let src = {
  import : m('src/import/', /\.js$/).filter(notGrunt),
  vendor : m('src/vendor/', /\.js$/).filter(notGrunt),
  constants : m('src/constants/', /\.js$/).filter(notGrunt),
  predicates : m('src/predicates/', /\.js$/).filter(notGrunt),
  common : m('src/common/', /\.js$/).filter(notGrunt),
  containers : m('src/containers/', /\.js$/).filter(notGrunt),
  components : m('src/components/', /\.js$/).filter(notGrunt),
  custom : m('src/custom/', /\.js$/).filter(notGrunt),
  collections : m('src/collections/', /\.js$/).filter(notGrunt),
  main : m('src/main/', /\.js$/).filter(notGrunt),
  init : m('src/init/', /\.js$/).filter(notGrunt),
  exports : m('src/exports/', /\.js$/).filter(notGrunt),
};

let dest = {
  development : {},
  production : {
    bundle : config.bundle
      ? 'bin/' + config.bundle + '.min.js'
      : 'bin/bundle.min.js'
  }
};

if (config.bundle) {
  dest.development.bundle = config.bundle
    ? 'bin/' + config.bundle + '.js'
    : 'bin/bundle.js';
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
    src.import,
    src.vendor,
    src.constants,
    src.predicates,
    src.custom,
    src.common,
    src.containers,
    src.components,
    src.collections,
    src.main,
    src.init,
    src.exports
  )
};
