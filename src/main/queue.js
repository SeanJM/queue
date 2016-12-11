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
