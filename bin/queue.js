(function () {
RESERVED_METHODS = ['wait', 'push'];

function isPromise(value) {
  return value && typeof value.then === 'function';
}

function Queue(instance, methods) {
  var self = this;

  function QueueProxy() {}

  this.list = [];
  this.isWaiting = false;
  this.mirror = new QueueProxy(),
  this.instance = instance;

  methods.forEach(function (methodName) {
    QueueProxy.prototype[methodName] = self.extend(methodName);
  });
}

Queue.prototype.wait = function (ms) {
  if (arguments.length > 1) {
    throw 'Invalid number of arguments (' + arguments.length + '), the \'wait\' method takes a single argument: time in miliseconds.';
  }
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
};

Queue.prototype.push = function (callback) {
  return callback();
};

Queue.prototype.extend = function (methodName) {
  var self = this;

  return function () {
    var i = 0;
    var n = arguments.length;
    var opt = {
      name : methodName,
      arguments : new Array(n),
      self : self,
      method : Queue.prototype[methodName]
    };

    for (; i < n; i++) {
      opt.arguments[i] = arguments[i];
    }

    if (RESERVED_METHODS.indexOf(methodName) === -1) {
      opt.self = self.instance;
      opt.method = self.instance[methodName];
    }

    self.list.push(opt);
    self.next();
    return self.mirror;
  };
};

Queue.prototype.next = function () {
  var maybePromise;
  var first = this.list[0];
  var self = this;

  if (!this.isWaiting && first) {
    this.list.shift(); // This position prevents a stack overflow
    maybePromise = first.method.apply(first.self, first.arguments);

    if (isPromise(maybePromise)) {
      this.isWaiting = true;
      maybePromise.then(function () {
        self.isWaiting = false;
        self.next();
      });
    } else {
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
        throw new Error('Method \"' + RESERVED_METHODS[RESERVED_METHODS.indexOf(methods[i])] + '\" is a reserved method name.');
      }
    }

    [].push.apply(methods, RESERVED_METHODS);
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