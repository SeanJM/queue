const isTypeEqual = require('./predicates/isTypeEqual');
const typeToString = require('./utilities/typeToString');
const maybePromise = require('../lib/maybePromise');

function Test(opt) {
  this.name = opt.name;

  this.passed = opt.passed;
  this.failed = opt.failed;
  this.index = opt.index;

  this.method = {
    resolve : [],
    reject : []
  };
}

Test.prototype.this = function (value) {
  this.a = value;
  return this;
};

Test.prototype.run = function() {
  var self = this;

  this.isCaught = [ false, false ];

  function pass() {
    self.passed[self.index] = (
      {
        index : self.index,
        name : self.name,
        a : self.a,
        b : self.b
      }
    );
  }

  function fail() {
    self.failed[self.index] = (
      {
        isCaught : self.isCaught,
        index : self.index,
        name : self.name,
        a : self.a,
        b : self.b
      }
    );
  }

  function checkFailure() {
    if (self.isCaught[0] && self.a.toString() === self.b) {
      pass();
    } else {
      fail();
    }
  }

  function checkEquality() {
    if (
      !self.isCaught[0] && !self.isCaught[1]
      && isTypeEqual(self.a, self.b) === self.equality
    ) {
      pass();
    } else {
      fail();
    }
  }

  function maybeRight(b_value) {
    self.b = b_value;

    if (self.isFailure) {
      checkFailure();
    } else {
      checkEquality();
    }

    self.resolve();
  }

  function maybeLeft(a_value) {
    self.a = a_value;

    maybePromise(self.b)
      .then(function (b_value) {
        maybeRight(b_value);
      })
      .catch(function (b_value) {
        self.isCaught[1] = true;
        maybeRight(b_value);
      });
  }

  maybePromise(this.a)
    .then(maybeLeft)
    .catch(function (a_value) {
      self.isCaught[0] = true;
      maybeLeft(a_value);
    });
};

Test.prototype.equal = function (value) {
  this.equality = true;
  this.b = value;
};

Test.prototype.notEqual = function (value) {
  this.equality = false;
  this.b = value;
};

Test.prototype.fail = function (value) {
  this.isFailure = true;

  if (typeof value !== 'string') {
    throw (
      'Invalid argument for \'shouldFail\', the value should be the error message'
    );
  }

  this.b = value;
};

Test.prototype.then = function (callback) {
  if (typeof callback === 'function') {
    this.method.resolve.push(
      callback
    );
  } else {
    throw 'callback is not a function';
  }
  return this;
};

Test.prototype.catch = function (callback) {
  if (typeof callback === 'function') {
    this.method.reject.push(
      callback
    );
  } else {
    throw 'callback is not a function';
  }
  return this;
};

Test.prototype.resolve = function (value) {
  this.method.resolve.forEach(
    function (callback) {
      callback(value);
    }
  );

  this.method = {
    resolve : [],
    reject : []
  };

  return this;
};

Test.prototype.reject = function (value) {
  this.method.reject.forEach(
    function (callback) {
      callback(value);
    }
  );

  this.method = {
    resolve : [],
    reject : []
  };

  return this;
};

module.exports = Test;
