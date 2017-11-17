'use strict'

const assert = require('assert')
const BlindsEncoder = require('../encoder.blinds')
const { bitsToLayout } = require('../util')
const { encode5, decode5 } = require('../url-safe-base64.js')

/* Split into 4 sections
| flop  | turn |
|   30  |  30  | 60
-------------------
| river | total |
|  30   |  30  |  60

Total length: 120 == 20 base64 words
*/

const POT_BITS = 30
const words = 4 * POT_BITS / 6

/* eslint-disable comma-spacing */
const layout1 = bitsToLayout([
    [ 'flop'  , POT_BITS ]
])
const layout2 = bitsToLayout([
    [ 'turn'  , POT_BITS ]
])
const layout3 = bitsToLayout([
    [ 'river' , POT_BITS ]
])
const layout4 = bitsToLayout([
    [ 'total' , POT_BITS ]
])

class PotsEncoder {
  constructor() {
    this._flop = new BlindsEncoder(layout1.flop, POT_BITS)
    this._turn = new BlindsEncoder(layout2.turn, POT_BITS)
    this._river = new BlindsEncoder(layout3.river, POT_BITS)
    this._total = new BlindsEncoder(layout4.total, POT_BITS)
  }

  encode(pots) {
    const bits1 = this._flop.encode(pots.flop)
    const bits2 = this._turn.encode(pots.turn)
    const bits3 = this._river.encode(pots.river)
    const bits4 = this._total.encode(pots.total)
    return [ bits1, bits2, bits3, bits4 ]
  }

  decode(bits1, bits2, bits3, bits4) {
    return {
      flop  : this._flop.decode(bits1)
    , turn  : this._turn.decode(bits2)
    , river : this._river.decode(bits3)
    , total : this._total.decode(bits4)
    }
  }
}

const potsEncoder = new PotsEncoder()

const ALL_ZERO = { flop: 0, turn: 0, river: 0, total: 0 }
function encode(pots) {
  pots = Object.assign({}, ALL_ZERO, pots)
  const [ bits1, bits2, bits3, bits4 ] = potsEncoder.encode(pots)
  return encode5(bits1) + encode5(bits2) + encode5(bits3) + encode5(bits4)
}

function decode(s) {
  assert.equal(s.length, words)
  const bits1 = decode5(s.slice(0, 5))
  const bits2 = decode5(s.slice(5, 10))
  const bits3 = decode5(s.slice(10, 15))
  const bits4 = decode5(s.slice(15, 20))
  return potsEncoder.decode(bits1, bits2, bits3, bits4)
}

module.exports = { encode, decode, words }
