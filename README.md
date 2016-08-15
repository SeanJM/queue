# QUEUE

Queue is a function which you wrap around an object to add 3 methods:

- `wait`
- `push`
- `clear`

## `wait`

Will wait until either the time or a promise has run

- `method.wait([ miliseconds ]);`
- `method.wait([ miliseconds ], [ function ]);`
- `method.wait([ function ], [ miliseconds ]);`

- `method.wait([ Promise ]);`
- `method.wait([ Promise ], [ function ]);`
- `method.wait([ function ], [ Promise ]);`

## `push`

- Accepts a function
- Accepts an object with with an `accept` method

### function

Push a `function` into the queue, if your `function` returns a `Promise`, it will behave like `wait` in that it won't trigger the next method till the promise resolves

`method.push([function]);`

### `accept` object

Push an object with an accept method into the queue. if your `accept` method returns a `Promise`, it will behave like `wait` in that it won't trigger the next method till the promise resolves

`method.push([Object])`

## `clear`

Removes everything in the queue.

`method.clear();`

## Example

```javascript
var myConstructor = queue(new Constructor());

myConstructor
  .wait(100)
  .someMethod()
  .wait(myPromise)
  .someOtherMethod();
```

## License

[WTFPL](https://en.wikipedia.org/wiki/WTFPL)
