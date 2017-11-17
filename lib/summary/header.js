'use strict'

const assert = require('assert')

const headerInfo = require('./header.info')
const headerChips = require('./header.chips')

// Header: 15 digits
// | info | chips           |
// | 5    | 10 (4 + 4 + 2)  |

function encode(header) {
  return headerInfo.encode(header) + headerChips.encode(header)
}

function decode(s) {
  assert.equal(s.length, 15)

  const info = headerInfo.decode(s.slice(0, 5))
  const chips = headerChips.decode(s.slice(5, 15))
  return Object.assign(info, chips)
}

module.exports = { encode, decode, words: 15 }
