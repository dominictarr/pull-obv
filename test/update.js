var More = require('../')

var a = []
for (var i = 0; i < 5; i++)
  a.push(i)

var tape = require('tape')

tape('single', function (t) {

  var i = 0
  var obv = More(function (state, item) {
    if(!state) return  {log: []}
    state.log.push(item)
    return state
  }, function (_, cb) {
    cb(i >= a.length, a[i++])
  })

  obv(function (state) {
    console.log(state.log.length)
    return true
  })

  t.deepEqual(obv.value, {
    reading: false,
    ended: true,
    log: [0, 1,2,3,4]
  })

  t.end()

})


tape('async', function (t) {

  var i = 0
  var obv = More(function (state, item) {
    if(!state) return  {log: []}
    state.log.push(item)
    return state
  }, function (_, cb) {
    setImmediate(function () {
      cb(i >= a.length, a[i++])
    })
  })

  obv(function (state) {
    console.log(state.log.length)
    if(state.ended) {
      t.deepEqual(obv.value, {
        reading: false,
        ended: true,
        log: [0, 1,2,3,4]
      })

      t.end()
    }
    return true
  })


})

tape('init', function (t) {
  var obv = More(function () {
    return 1
  }, function () {
    throw new Error('should not be called')
  })

  t.equal(obv.value, 1)
  t.end()
})
