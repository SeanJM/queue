function wait(queue) {
  return function (a, b) {
    var miliseconds;
    var callback;

    if (arguments.length > 2) {
      throw 'Invalid number of arguments (' + arguments.length + '), the \'wait\' method takes a maximum of 2 arguments, a function and a number.';
    }

    if (typeof a === 'number') {
      miliseconds = a;
    } else if (typeof a === 'function') {
      callback = a;
    }

    if (typeof b === 'number') {
      miliseconds = b;
    } else if (typeof b === 'function') {
      callback = b;
    }

    setTimeout(function () {
      if (typeof callback === 'function') {
        queue.mirror.push(callback);
      } else {
        queue.next();
      }
    }, miliseconds);

    return queue.mirror;
  };
}
