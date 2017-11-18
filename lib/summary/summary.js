'use strict'

const assert = require('assert')
const fixedEncoder = require('./summary.fixed')
const variableEncoder = require('./summary.variable')

/*
Two parts. First the fixed length records, then the variable length records
separated by separator.
*/

/**
 * Encodes a PokerHand summary that was obtained via hha.summary.
 * @see https://github.com/thlorenz/hha
 *
 * @name summary.encode
 *
 * @param {Object} summary the summary to encode
 * @returns {String} the *custom* base64 encoded string containing the summary
 */
function encode(summary) {
  const fixed = fixedEncoder.encode(summary)
  assert.equal(fixed.length, fixedEncoder.words)

  const variable = variableEncoder.encode(summary)
  return fixed + variable
}

/**
 * Decodes a PokerHand summary encoded via `summary.encode`.
 *
 * @name summary.decode
 *
 * @param {String} s *custom* base64 encoded summary
 * @returns {Object} decoded summary
 */
function decode(s) {
  var pos = 0
  const fixedChars = s.slice(pos, (pos += fixedEncoder.words))
  const variableChars = s.slice(pos)

  const summaryFixed = fixedEncoder.decode(fixedChars)
  const summaryVariable = variableEncoder.decode(variableChars)

  return Object.assign(summaryFixed, summaryVariable)
}

module.exports = { encode, decode }
