'use strict'

const { roman, decimal } = require('roman-decimal')

const {
    Translator
  , bitsToLayout
  , number
} = require('../util')

/*
| room  | gametype | currency | pokertype | limit | maxseats | level      | _total_
| 00000 | 000      | 0000     | 0000      | 00    | 0000     | 00000000   |
|   5   |  3       |  4       | 4         | 2     |   4      |    8       | 30
*/

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
  , 'cash'        // 1
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

function romanLowerCase(n) {
  return roman(n).toLowerCase()
}

class Header {
  constructor() {
    this._room      = new Translator(room, headerLayout.room)
    this._gametype  = new Translator(gametype, headerLayout.gametype)
    this._currency  = new Translator(currency, headerLayout.currency)
    this._pokertype = new Translator(pokertype, headerLayout.pokertype)
    this._limit     = new Translator(limit, headerLayout.limit)
    this._maxseats  = new Translator(number, headerLayout.maxseats)
    this._level     = new Translator(number, headerLayout.level, decimal, romanLowerCase)
  }

  encode(header) {
    var bits = 0
    bits |= this._room.encode(header.room)
    bits |= this._gametype.encode(header.gametype)
    bits |= this._currency.encode(header.currency)
    bits |= this._pokertype.encode(header.pokertype)
    bits |= this._limit.encode(header.limit)
    bits |= this._maxseats.encode(header.maxseats)
    bits |= this._level.encode(header.level)
    return bits
  }

  decode(bits) {
    return {
        room      : this._room.decode(bits)
      , gametype  : this._gametype.decode(bits)
      , currency  : this._currency.decode(bits)
      , pokertype : this._pokertype.decode(bits)
      , limit     : this._limit.decode(bits)
      , maxseats  : this._maxseats.decode(bits)
      , level     : this._level.decode(bits)
    }
  }
}

const header = new Header()
module.exports = header

const headerSample = {
  room: 'ignition',
  gametype: 'tournament',
  currency: '$',
  pokertype: 'holdem',
  limit: 'fixedlimit',
  level: 'xi',
  maxseats: 9,
  donation: 0.91,
  rake: 0.09,
  sb: 400,
  bb: 800,
  ante: 50
}
const bs = header.encode(headerSample)
console.log({ len: bs.toString(2).length, bs: bs.toString(2) })
console.log(header.decode(bs))
