'use strict'

const assert = require('assert')
const BlindsEncoder = require('../encoder.blinds')
const { bitsToLayout } = require('../util')
const { encode5, decode5 } = require('../url-safe-base64.js')

/* Split into 2 sections with 2 pots each
| flop  | turn |
|   15  |  15  | 30
-------------------
| river | total |
|  15   |   15  |  30

Total length: 60 == 10 base64 words
*/

const POT_BITS = 15

/* eslint-disable comma-spacing */
const layout1 = bitsToLayout([
    [ 'turn'  , POT_BITS ]
  , [ 'flop'  , POT_BITS ]
])
const layout2 = bitsToLayout([
    [ 'total' , POT_BITS ]
  , [ 'river' , POT_BITS ]
])

class PotsEncoder {
  constructor() {
    this._flop = new BlindsEncoder(layout1.flop, POT_BITS)
    this._turn = new BlindsEncoder(layout1.turn, POT_BITS)
    this._river = new BlindsEncoder(layout2.river, POT_BITS)
    this._total = new BlindsEncoder(layout2.total, POT_BITS)
  }

  encode(pots) {
    var bits1 = 0
    bits1 |= this._flop.encode(pots.flop)
    bits1 |= this._turn.encode(pots.turn)
    var bits2 = 0
    bits2 |= this._river.encode(pots.river)
    bits2 |= this._total.encode(pots.total)
    return [ bits1, bits2 ]
  }

  decode(bits1, bits2) {
    return {
      flop  : this._flop.decode(bits1)
    , turn  : this._turn.decode(bits1)
    , river : this._river.decode(bits2)
    , total : this._total.decode(bits2)
    }
  }
}

const potsEncoder = new PotsEncoder()

const ALL_ZERO = { flop: 0, turn: 0, river: 0, total: 0 }
function encode(pots) {
  pots = Object.assign({}, ALL_ZERO, pots)
  const [ bits1, bits2 ] = potsEncoder.encode(pots)
  return encode5(bits1) + encode5(bits2)
}

function decode(s) {
  assert.equal(s.length, 10)
  const bits1 = decode5(s.slice(0, 5))
  const bits2 = decode5(s.slice(5, 10))
  return potsEncoder.decode(bits1, bits2)
}

module.exports = { encode, decode, words: 10 }
