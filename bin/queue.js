(function () {
RESERVED_METHODS = ['wait', 'push'];

function isPromise(value) {
  return value && typeof value.then === 'function';
}

function Queue(instance, methods) {
  var self = this;

  function Mirror() {}

  this.list = [];
  this.wait = false;
  this.mirror = new Mirror(),
  this.instance = instance;

  Mirror.prototype.wait = function (miliseconds) {
    setTimeout(function () { self.next(); }, miliseconds);
    return this;
  };

  Mirror.prototype.push = function (callback) {
    self.list.push({
      name : callback.name,
      method : callback,
      arguments : []
    });

    self.next();
    return this;
  };

  methods.forEach(function (method) {
    Mirror.prototype[method] = self.extend(method);
  });
}

Queue.prototype.extend = function (methodName) {
  var self = this;

  return function () {
    var i = 0;
    var n = arguments.length;
    var $arguments = new Array(n);

    for (; i < n; i++) {
      $arguments[i] = arguments[i];
    }

    self.list.push({
      name : methodName,
      method : self.instance[methodName],
      arguments : $arguments
    });

    self.next();
    return self.mirror;
  };
};

Queue.prototype.next = function () {
  var maybePromise;
  var first = this.list[0];
  var self = this;

  // What if the method is 'then' or 'complete' ?
  if (!this.wait && first) {
    maybePromise = first.method.apply(this.instance, first.arguments);
    if (isPromise(maybePromise)) {
      this.wait = true;
      maybePromise.then(function () {
        self.wait = false;
        self.list.shift();
        self.next();
      });
    } else {
      this.list.shift();
      this.next();
    }
  }
};

function getMethodKeys(object) {
  var methods = [];

  if (typeof object === 'undefined') {
    return false;
  }

  for (var k in object) {
    if (typeof object[k] === 'function') {
      methods.push(k);
    }
  }

  return methods;
}

function queue(instance) {
  var methods = getMethodKeys(instance);
  var i;
  var n;

  if (!methods) {
    throw new Error('Invalid object to queue. Your argument is undefined.');
  } else if (typeof instance.constructor === 'undefined') {
    throw new Error('Invalid argument to queue. Your argument does not have a constructor method.');
  } else {
    i = 0;
    n = methods.length;
    for (; i < n; i++) {
      if (RESERVED_METHODS.indexOf(methods[i]) > -1) {
        throw new Error('Method \"wait\" is a reserved method name.');
      }
    }
  }

  return new Queue(instance, methods).mirror;
}

if (typeof module === 'object' && module.exports) {
  module.exports = queue;
} else if (window) {
  window.queue = queue;
}

}());
//# sourceMappingURL=queue.js.map