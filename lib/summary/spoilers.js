'use strict'

const assert = require('assert')
const spoiler = require('./spoiler')

function encode(ss) {
  var res = ''
  for (const si of ss) {
    const s = spoiler.encode(si)
    res += s
  }
  return res
}

function decode(s) {
  assert.equal(s.length % 3, 0, 'expecting 3 chars per spoiler')
  const spoilers = []
  for (var i = 0; i < s.length; i += 3) {
    spoilers.push(spoiler.decode(s[i] + s[i + 1] + s[i + 2]))
  }
  return spoilers
}

module.exports = { encode, decode }
