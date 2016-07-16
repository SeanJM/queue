(function () {
  /* Documentation: http://www.github.com/SeanJM/qeue */

  function step(self) {
    self._wait_ = false;
    self._index_ += 1;
    next(self);
  }

  function waitPromise(promise, func, self) {
    promise.then(function () {
      func();
      step(self);
    });
  }

  function waitTimeout(time, func, self) {
    setTimeout(
      function () {
        func();
        step(self);
      }, 
      time
    );
  }

  function waitFunction(func, self) {
    var res = func();
    // Check for promise like methods on the returned value          
    self._wait_ = true;
    if (res && typeof res.then === 'function') {
       res.then(function res_then() { 
         step(self);
       });
       if (typeof res.catch === 'function') {
         res.catch(function res_catch() {
           step(self);
         });
       } 
    } else if (res && typeof res.complete === 'function') {
       res.complete(function res_complete() {
         step(self);
       });
    } else {
      step(self);
    }
  }

  function push(self) {
    var element = self._queue_[self._index_];
    if (typeof element.arguments[0] === 'function') {
      waitFunction(element.arguments[0], self);
    }
  }

  function wait(self) {
    var element = self._queue_[self._index_];
    var n = element.arguments.length;
    
    self._wait_ = true;

    switch (n) {
      case 1: {
        if (typeof element.arguments[0] === 'function') {
          waitFunction(element.arguments[0], self);
        } else if (
          element.arguments[0]
          && typeof element.arguments[0].then === 'function'
        ) {
          element.arguments[0].then(function () {
            step(self);
          });
        } else if (
          element.arguments[0]
          && typeof element.arguments[0].complete === 'function'
        ) {
          element.arguments[0].complete(function () {
            step(self); 
          }); 
        } else if (typeof element.arguments[0] === 'number') {
          setTimeout(function () { 
            step(self); 
          }, element.arguments[0]);
        } else {
          throw 'Invalid arguments, \'wait\' expects the argument to be a number, or Promise like';
        }

        return;
      }  

      case 2: {
        if (
          typeof element.arguments[0] === 'number'
          && typeof element.arguments[1] === 'function'  
        ) {
          waitTimeout(element.arguments[0], element.arguments[1], self);
        } else if (
          typeof element.arguments[0] === 'function'
          && typeof element.arguments[1] === 'number'
        ) {
          waitTimeout(element.arguments[1], element.arguments[0], self);
        } else if (
          // Check for a promise
          typeof element.arguments[0] === 'function'
          && typeof element.arguments[1] === 'object'
          && typeof element.arguments[1].then === 'function'
        ) {
          waitPromise(element.arguments[1], element.arguments[0], self);
        } else if (
          // Check for a promise
          typeof element.arguments[1] === 'function'
          && typeof element.arguments[0] === 'object'
          && typeof element.arguments[0].then === 'function'
        ) {
          waitPromise(element.arguments[0], element.arguments[1], self);
        } else {
          throw 'Invalid arguments';
        }
      }
    }
  }

  function next(self) {
    var result;
    var element = self._queue_[self._index_];

    var method = element 
      ? element.method 
      : undefined;

    var instance = element
      ? element.instance
      : undefined;

    var args = element
      ? element.arguments
      : undefined;

    if (!self._wait_ && element) {
      if (method === 'wait') {
        wait(self);
      } else if (method === 'push') {
        push(self);
      } else {
        result = instance[method].apply(instance, args);

        if (result && typeof result.then === 'function') {
          self._wait_ = true;
          result.then(function result_then() {
            step(self);
          });
        } else if (result && typeof result.complete === 'function') {
          self._wait_ = true;
          result.complete(function result_complete() {
            step(self);
          });
        } else if ((
          !!result
          && typeof result.catch !== 'function'
          && typeof result.then !== 'function'
          && typeof result.complete !== 'function'
        ) || (
          !result
        )) {
          step(self);
        }

        if (result && typeof result.catch === 'function') {
          self._wait_ = true;
          result.catch(function () {
            step(self);
          });
        }
      }
    }
  }

  function enqueue(self, instance, method) {
    return function () {
      var a = [];
      var i = 0;
      var n = arguments.length;

      for (; i < n; i++) {
        a.push(arguments[i]);
      }

      self._queue_.push({
        instance : instance,
        method : method,
        arguments : a
      });

      self._mirror_.length = self._queue_.length;

      next(self);

      return self._mirror_;
    };
  }

  function clear(self) {
    return function () {
      self = {
        _queue_ : [],
        _wait_ : false,
        _index_ : 0
      };

      self._mirror_.length = 0;

      return self._mirror_;
    }; 
  }

  function queue(instance) {
    var prototype = instance.constructor.prototype;
    
    var Mirror = function () {
      this.length = 0;
    };

    var self = {
      _queue_ : [],
      _wait_ : false,
      _mirror_ : new Mirror(),
      _index_ : 0
    };

    // Load the Mirror object a an abstraction of all the instance methods
    // this preserves the method chain and allows each method to be queued
    // and executed in order.
    Object
      .getOwnPropertyNames(prototype)
      .forEach(function (method) {
        if (
          method !== 'constructor'
          && method !== 'arguments'
          && method !== 'length'
          && method !== 'caller'
          && typeof prototype[method] === 'function' 
        ) {
          Mirror.prototype[method] = enqueue(self, instance, method);
        }
      });

    Mirror.prototype.wait = enqueue(self, instance, 'wait');
    Mirror.prototype.push = enqueue(self, instance, 'push');
    Mirror.prototype.clear = clear(self);

    return self._mirror_;
  }

  // Export to NodeJS or to the global object 'window'
  if (typeof module === 'object' && module.exports) {
    module.exports = queue;
  } else if (window) {
    window.queue = queue;
  }

}());
