(function () {
function Queue(instance, methods) {
  function Mirror() {}
  
  this.list = [];
  this.wait = false;
  this.mirror = new Mirror(),
  this.instance = instance;

  methods.forEach(function (method) {
    Mirror.prototype[method] = this.extend(method);
  });
}

Queue.prototype.extend = function (method) {
  var self = this;

  return function () {
    var a = [];
    var i = 0;
    var n = arguments.length;

    for (; i < n; i++) a.push(arguments[i]);

    self._queue_.list.push({
      method : method,
      arguments : a
    });

    self.next();

    return self._queue_.mirror;
  };
};

Queue.prototype.next = function () {
  var result;
  var a = self._queue_[0];

  function future(self, f) {
    self._wait_ = true;
    f(function () {
      self._wait_ = false;
      self._queue_.shift();
      next(self);
    });
  }

  // What if the method is 'then' or 'complete' ?
  if (!self._wait_ && a) {

    result = a.instance[a.method].apply(a.instance, a.arguments);

    if (result && typeof result.then === 'function') {
      future(self, result.then);
    } else if (result && typeof result.complete === 'function') {
      future(self, result.complete);
    } else {
      self._queue_.shift();

      next(self);
    }
  }
};

Queue.prototype.wait = function (s) {
  setTimeout(function () {
    next(self);
  }, s);
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

  if (!methods) {
    throw new Error('Invalid object to queue. Your argument is undefined.');
  } else if (typeof instance.constructor === 'undefined') {
    throw new Error('Invalid argument to queue. Your argument does not have a constructor method.');
  } else if (methods.indexOf('wait') > -1) {
    throw new Error('Method \"wait\" is a reserved method name.');
  }

  return new Queue(instance, methods).mirror;
}

if (typeof module === 'object' && module.exports) {
  module.exports = queue;
} else if (window) {
  window.queue = queue;
}

}());
//# sourceMappingURL=bundle.js.map