'use strict'

const assert = require('assert')
const seat = require('./seat')

function encode(ss) {
  var res = ''
  for (const si of ss) {
    const s = seat.encode(si)
    res += s
  }
  return res
}

function decode(s) {
  assert.equal(s.length % 3, 0, 'expecting 3 chars per seat')
  const seats = []
  for (var i = 0; i < s.length; i += 3) {
    seats.push(seat.decode(s[i] + s[i + 1] + s[i + 2]))
  }
  return seats
}

module.exports = { encode, decode }
