function isArrayEqual(a, b) {
  const isTypeEqual = require('./isTypeEqual');

  let i = 0;
  let n = a.length;

  if (a.length === b.length) {
    for (; i < n; i++) {
      if (!isTypeEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }

  return false;
}

module.exports = isArrayEqual;
