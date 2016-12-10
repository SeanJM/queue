function push(queue) {
  return function (callback) {
    queue.list.push({
      name : callback.name || 'Anonymous Function',
      method : callback,
      arguments : []
    });

    queue.next();

    return queue.mirror;
  };
}
