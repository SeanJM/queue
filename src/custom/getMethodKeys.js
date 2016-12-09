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
