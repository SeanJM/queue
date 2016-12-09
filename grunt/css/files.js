const fs = require('fs');
const path = require('path');
const m = require('match-file-utility');
const config = JSON.parse(fs.readFileSync('package.json')).gruntBuild;

const order = [
  'constants.scss',
  'functions.scss',
  'mixins.scss',
  'placeholders.scss',
  'resets.scss',
  'base.scss',
  'typeography.scss'
];

let task = {};
let list = [];

function byType(a, b) {
  let abase = path.basename(a);
  let bbase = path.basename(b);

  if (order.includes(abase) && order.includes(bbase)) {
    return order.indexOf(abase) - order.indexOf(bbase);
  }

  if (order.includes(abase)) {
    return -1;
  }

  if (order.includes(bbase)) {
    return 1;
  }

  return 0;
}

let src = {
  vendor : list.concat(m('src/application/styles/vendor', /\.scss$/).sort(byType)),
  base : list.concat(m('src/application/styles/base', /\.scss$/).sort(byType)),
  fonts : list.concat(m('src/application/fonts/', /\.scss$/).sort(byType)),
  constants : list.concat(m('src/application/styles/constants', /\.scss$/).sort(byType)),
  functions : list.concat(m('src/application/styles/functions', /\.scss$/).sort(byType)),
  mixins : list.concat(m('src/application/styles/mixins', /\.scss$/).sort(byType)),
  animation : list.concat(m('src/application/styles/animation', /\.scss$/).sort(byType)),
  placeholders : list.concat(m('src/application/styles/placeholders', /\.scss$/).sort(byType)),
  components : list.concat(m('src/application/styles/components/', /\.scss$/).sort(byType)),
  containers : list.concat(m('src/application/styles/containers/', /\.scss$/).sort(byType)),
  collections : list.concat(m('src/application/styles/collections/', /\.scss$/).sort(byType)),
  custom : list.concat(m('src/application/styles/custom', /\.scss$/).sort(byType)),
  main : list.concat(m('src/application/styles/main', /\.scss$/).sort(byType)),
  conditional : list.concat(m('src/application/styles/conditional', /\.scss$/).sort(byType)),
};

let dest = {};

if (config.bundle) {
  dest = 'bin/' + config.bundle + '.css';
} else {
  dest = 'bin/bundle.css';
}

module.exports = {
  src : src,
  dest : dest,
  import : config.isSite ? 'src/application/import.scss' : 'src/import.scss',
  list : [].concat(
    src.vendor,
    src.base,
    src.fonts,
    src.constants,
    src.functions,
    src.mixins,
    src.animation,
    src.placeholders,
    src.components,
    src.containers,
    src.collections,
    src.custom,
    src.main,
    src.conditional
  )
};
