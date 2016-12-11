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
