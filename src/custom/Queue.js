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
