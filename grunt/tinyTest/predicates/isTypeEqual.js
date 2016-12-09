const isArrayEqual = require('./isArrayEqual');
const isObjectEqual = require('./isObjectEqual');

function isTypeEqual(a, b) {
  if (
    ['string', 'boolean', 'undefined']
      .includes(typeof a)
  ) {
    return a === b;
  } else if (typeof a === 'number') {
    if (isNaN(a) && isNaN(b)) {
      return true;
    }
    return a === b;
  } else if (Array.isArray(a) && Array.isArray(b)) {
    return isArrayEqual(a, b);
  } else if (typeof a === 'object' && typeof b === 'object') {
    return isObjectEqual(a, b);
  }
  return false;
}

module.exports = isTypeEqual;
