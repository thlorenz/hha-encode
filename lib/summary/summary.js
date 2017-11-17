'use strict'

const assert = require('assert')
const fixedEncoder = require('./summary.fixed')
const variableEncoder = require('./summary.variable')

/*
Two parts. First the fixed length records, then the variable length records
separated by separator.
*/

function encode(summary) {
  const fixed = fixedEncoder.encode(summary)
  assert.equal(fixed.length, fixedEncoder.words)

  const variable = variableEncoder.encode(summary)
  return fixed + variable
}

function decode(s) {
  var pos = 0
  const fixedChars = s.slice(pos, (pos += fixedEncoder.words))
  const variableChars = s.slice(pos)

  const summaryFixed = fixedEncoder.decode(fixedChars)
  const summaryVariable = variableEncoder.decode(variableChars)

  return Object.assign(summaryFixed, summaryVariable)
}

module.exports = { encode, decode }
