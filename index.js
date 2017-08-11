
module.exports = function More (reduce, get, state) {

  if(!state)
    state = reduce(state, null)

  var listeners = []

  var fn
  //implement an observable
  function obv (fn, immediate) {
    listeners.push(fn)
    if(immediate !== false && fn(state) === true) obv.more()
    return function () {
      var i = listeners.indexOf(fn)
      listeners.splice(i, 1)
    }
  }

  obv.value = state

  obv.more = function () {
    if(state.reading) return //only allow one request at a time
    state.reading = true
    get(null, function (err, data) {
      state.reading = false
      if(err) state.ended = err
      else obv.value = state = reduce(state, data)

      var more = false
      if(state) {
        for(var i = 0;i < listeners.length; i++)
          more = listeners[i](state) || more
      }
      if(more && (state && !state.ended))
        obv.more()
    })
  }

  return obv
}







