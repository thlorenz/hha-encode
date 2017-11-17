'use strict'

const assert = require('assert')

const headerInfo = require('./header.info')
const headerChips = require('./header.chips')
const infoWords = headerInfo.words
const chipsWords = headerChips.words
const totalWords = infoWords + chipsWords

// Header: 16 digits
// | info | chips           |
// | 5    | 11 (5 + 4 + 2)  |

function encode(header) {
  const headerInfoEncoded = headerInfo.encode(header)
  const headerChipsEncoded = headerChips.encode(header)

  const res =  headerInfoEncoded + headerChipsEncoded
  assert.equal(res.length, totalWords)
  return res
}

function decode(s) {
  assert.equal(s.length, totalWords)

  const info = headerInfo.decode(s.slice(0, infoWords))
  const chips = headerChips.decode(s.slice(infoWords, totalWords))
  return Object.assign(info, chips)
}

module.exports = { encode, decode, words: totalWords }
