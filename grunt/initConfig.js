const fs = require('fs');
const flatman = require('./flatman');
const readme = require('./readme');
const scripts = require('./scripts');
const css = require('./css');
const images = require('./images');
const fonts = require('./fonts');

const config = JSON.parse(fs.readFileSync('package.json')).gruntBuild;

module.exports = {
  copy : {
    fonts : {
      expand : true,
      flatten : true,
      src : fonts.files,
      dest : 'bin/'
    },
    images : images.task.copy
  },

  sass : css.task.sass,

  cssmin : css.task.cssmin,

  concat : scripts.task.concat,

  uglify : scripts.task.uglify,

  autoprefixer : css.task.autoprefixer,

  imagemin : images.task.imagemin,

  svgstore : images.task.svgstore,

  watch : config.isProduction
    ? {}
    : Object.assign({
    // Flatman
    flatman : {
      files : flatman.glob,
      tasks : ['flatman']
    },

    readme : {
      files : readme.glob,
      tasks : ['readme']
    },

    // Config and Environment
    configFiles : {
      files : ['Gruntfile.js'],
      options : {
        reload : true
      },
      tasks: ['default']
    }
  },
    scripts.task.watch,
    css.task.watch,
    images.task.watch
  )
};
