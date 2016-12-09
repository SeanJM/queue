function isObjectEqual(a, b) {
  const isTypeEqual = require('./isTypeEqual');

  for (let k in a) {
    if (!isTypeEqual(a[k], b[k])) {
      return false;
    }
  }

  return true;
}

module.exports = isObjectEqual;
