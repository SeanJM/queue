if (typeof module === 'object' && module.exports) {
  module.exports = queue;
} else if (window) {
  window.queue = queue;
}
