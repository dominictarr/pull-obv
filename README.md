# pull-obv

turn a pull-stream into an observable.

## example

``` js
var More = require('pull-obv')

//takes a reduce function and a pull stream source (or other async function)
var obv = More(function reduce (state, item) {
  return (state.value || 0) + item
}, pull.values(1,2,3))

//it won't start listening until a listener is subscribed
obv(function (state) {
  //if the listener returns true, request more data.
  return true
  //alternativly, call obv.more() can be called async
  obv.more()
})
```

## More(reduce, get) => obv

## reduce(state, item)

`item` is whatever the stream gives. `state` is always an {}
with properties `{reading: boolean, ended: boolean | Error, more: boolean}`
and whatever else is added by the `reduce` function. If more is truthy,
the stream will continue to be read. (this is just one way of requesting more.
also, return true in listener, or call `obv.more()`)

## get (abort, cb)

read the next item - note, this is the same as a pull-stream.
it should eventually cb(true) which means the stream is over.

## obv(fn)

Assign a listener. This observable supports only a single listener.
if `fn` returns true, more is read.

## obv.more()

read more. note, calling more once the state is already reading does nothing.

## obv.value

access the internal value of the observable

## License

MIT

