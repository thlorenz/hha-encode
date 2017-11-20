'use strict'

const assert = require('assert')

const { roman, decimal } = require('roman-decimal')
const { encode5, decode5 } = require('6bit-encoder')
const { istourney } = require('../util')

const {
    bitsToLayout
  , number
} = require('../util')

const Encoder = require('../encoder')

/*
| room  | gametype | currency | pokertype | limit | maxseats | level      | _total_
| 00000 | 000      | 0000     | 0000      | 00    | 0000     | 00000000   |
|   5   |  3       |  4       | 4         | 2     |   4      |    8       | 30
*/

const words = 5

// 00001 000 0000 0000 10 1001 00001011

// binary bits starting from least significant bit
/* eslint-disable comma-spacing */
const headerBits = [
    [ 'level'     , 8 ]
  , [ 'maxseats'  , 4 ]
  , [ 'limit'     , 2 ]
  , [ 'pokertype' , 4 ]
  , [ 'currency'  , 4 ]
  , [ 'gametype'  , 3 ]
  , [ 'room'      , 5 ]
]
const headerLayout = bitsToLayout(headerBits)

// 32 rooms -> 5 bits
const room = [
    'pokerstars' // 0
  , 'ignition'   // 1
]

// 8 gametypes -> 3 bits
const gametype = [
    'tournament'  // 0
  , 'cashgame'    // 1
]

// 16 currencies -> 4 bits
const currency = [
    '$' // 0
  , '€' // 1
]

// 16 pokertypes -> 4 bits
const pokertype = [
    'holdem'  // 0
]

// 4 limits -> 2 bits
const limit = [
    'nolimit'     // 0
  , 'potlimit'    // 1
  , 'fixedlimit'  // 2
]

function romanToDecimal(s) {
  if (s == null || s.length === 0) return 0
  return decimal(s)
}

function decimalToRoman(n) {
  if (n == null || n === 0) return 'i'
  return roman(n).toLowerCase()
}

class HeaderInfo {
  constructor() {
    this._room      = new Encoder(room, headerLayout.room)
    this._gametype  = new Encoder(gametype, headerLayout.gametype)
    this._currency  = new Encoder(currency, headerLayout.currency)
    this._pokertype = new Encoder(pokertype, headerLayout.pokertype)
    this._limit     = new Encoder(limit, headerLayout.limit)
    this._maxseats  = new Encoder(number, headerLayout.maxseats)
    this._level     = new Encoder(number, headerLayout.level, romanToDecimal, decimalToRoman)
  }

  encode(header) {
    var bits = 0
    bits |= this._room.encode(header.room)
    bits |= this._gametype.encode(header.gametype)
    bits |= this._currency.encode(header.currency)
    bits |= this._pokertype.encode(header.pokertype)
    bits |= this._limit.encode(header.limit)
    bits |= this._maxseats.encode(header.maxseats)
    bits |= istourney(header.gametype) ? this._level.encode(header.level) : 0
    return bits
  }

  decode(bits) {
    const res = {
        room      : this._room.decode(bits)
      , gametype  : this._gametype.decode(bits)
      , currency  : this._currency.decode(bits)
      , pokertype : this._pokertype.decode(bits)
      , limit     : this._limit.decode(bits)
      , maxseats  : this._maxseats.decode(bits)
    }
    if (istourney(res.gametype)) res.level = this._level.decode(bits)
    return res
  }
}

const headerInfo = new HeaderInfo()

function encode(hi) {
  const bits = headerInfo.encode(hi)
  const res = encode5(bits)
  assert.equal(res.length, words)
  return res
}

function decode(s) {
  assert.equal(s.length, words)

  const bits = decode5(s)
  return headerInfo.decode(bits)
}

module.exports = { encode, decode, words }
