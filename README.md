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

Push any `function` into the queue, if your `function` returns a `Promise`, it will behave like `wait` in that it won't trigger the next method till the promise resolves

`method.push([function]);`

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
