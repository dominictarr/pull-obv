
module.exports = function More (reduce, get) {

  var state = reduce(null)

  var fn
  function obv (_fn, immediate) {
    fn = _fn
    if(immediate !== false && _fn(state) === true) obv.more()
    return function () {
      fn = null
    }
  }

  obv.value = state

  obv.more = function () {
    if(state.reading) return //only allow one request at a time
    state.reading = true
    console.log('reading...')
    get(null, function (err, data) {
      state.reading = false
      if(err) state.ended = err
      else obv.value = state = reduce(state, data)

      if(fn && (state.more || fn(state) === true) && !state.ended)
        obv.more()
    })
  }

  return obv
}




