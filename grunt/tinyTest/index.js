const Test = require('./Test');
const colors = require('colors');

const padLeft = require('../lib/padLeft');
const padRight = require('../lib/padRight');
const typeToString = require('./utilities/typeToString');

function TinyTest(callback) {
  var self = this;
  var index = 1;

  if (typeof callback !== 'function') {
    throw 'TinyTest cannot run, you have not passed a valid callback.';
  }

  function test(name) {
    var promise_test = new Test(
      {
        name : name,
        passed : self.passed,
        failed : self.failed,
        index : index++
      }
    );

    self.list_tests.push(promise_test);

    return promise_test;
  }

  test.done = function () {
    test.ready();
  };

  this.passed = {};
  this.failed = {};

  this.isSilent = false;

  this.list_tests = [];
  this.date_start = new Date();

  this.method = {
    resolve : [],
    reject : []
  };

  setTimeout(function () {
    callback(test);

    test.ready = function () {
      self.log('\n Loading tests (' + self.list_tests.length.toString().cyan + ')\n');
      Promise.all(self.list_tests.map(a => a.run())).then(
        function () {
          self.complete();
        }
      );
    };
  }, 20);
}

TinyTest.prototype.printFail = function () {
  let total = (this.int_passed + this.int_failed);
  let perc = Math.round((this.int_failed / total) * 100).toString() + '%';
  this.log(
    '\n     -'.red + ' Failed: ' + this.int_failed + '/' + total + ' (' + perc.cyan + ')'
  );
};

TinyTest.prototype.printPass = function () {
  this.log(
    this.int_passed > 1
      ? '\n     +'.green + ' All ' + this.int_passed + ' tests passed'
      : '\n     + '.green + this.int_passed + ' test passed'
  );
};

TinyTest.prototype.printLength = function () {
  var time = (this.date_complete - this.date_start) / 1000;
  this.log(
    '       Completed in ' + time.toString().cyan + 's'.cyan + '\n'
  );
};

TinyTest.prototype.complete = function () {
  this.date_complete = new Date();

  this.int_failed = 0;
  this.int_passed = 0;

  for (var k in this.passed) {
    this.log(
      padLeft(this.passed[k].index + '. ', 6, ' ') + padRight(this.passed[k].name + ' ', 66, '.'.grey) + ' PASSED'.green
    );
    this.int_passed += 1;
  }

  for (k in this.failed) {
    this.logError(this.failed[k]);
    this.int_failed += 1;
  }

  if (this.int_failed) {
    this.printFail();
  } else {
    this.printPass();
  }

  this.printLength();
  this.resolve();
};

TinyTest.prototype.then = function (callback) {
  this.method.resolve.push(
    callback
  );

  return this;
};

TinyTest.prototype.catch = function (callback) {
  this.method.reject.push(
    callback
  );

  return this;
};

TinyTest.prototype.resolve = function () {
  var opt = {
    int_failed : this.int_failed,
    int_passed : this.int_passed,
    int_total : this.int_failed + this.int_passed,
    passed : this.passed,
    failed : this.failed
  };

  this.method.resolve.forEach(
    function (callback) {
      callback(opt);
    }
  );

  this.method = {
    resolve : [],
    reject : []
  };
};

TinyTest.prototype.reject = function (error) {
  this.method.resolve.forEach(
    function (callback) {
      callback(error);
    }
  );

  this.method = {
    resolve : [],
    reject : []
  };
};

TinyTest.prototype.silence = function () {
  this.isSilent = true;
  return this;
};

TinyTest.prototype.logError = function (value) {
  if (value.isCaught[0] || value.isCaught[1]) {
    this.log(
      '\n' + padLeft(value.index + '. ', 6, ' ') + padRight(value.name + ' ', 66, '.').red + ' FAILED'.red
    );

    if (value.isCaught[0]) {
      this.log(
        '     Right: '.red + value.a.toString().red
      );
    }
    if (value.isCaught[1]) {
      this.log(
        '    Left: '.red + value.a.toString().red
      );
    }
  } else {
    this.log(
      '\n' + padLeft(value.index + '. ', 6, ' ').red + padRight(value.name + ' ', 66, '.').red + ' FAILED'.red +
      '\n     +'.green + ' Right: ' + padLeft(typeToString(value.b), 64, ' ').grey +
      '\n     -'.red + '  Left: ' + padLeft(typeToString(value.a), 64, ' ').grey
    );
  }
};

TinyTest.prototype.log = function (value) {
  if (!this.isSilent) {
    console.log(value);
  }
};

module.exports = TinyTest;
