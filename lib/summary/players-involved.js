'use strict'

const assert = require('assert')
const Encoder = require('../encoder')
const { bitsToLayout, number } = require('../util')
const { encode3, decode3 } = require('../url-safe-base64.js')

/*
| flop  | turn | river | __total__
|   4   |   4  |   4   |    12 (3 words)
*/

/* eslint-disable comma-spacing */
const layout = bitsToLayout([
    [ 'river', 4 ]
  , [ 'turn' , 4 ]
  , [ 'flop' , 4 ]
])

class PlayersInvolvedEncoder {
  constructor() {
    this._flop = new Encoder(number, layout.flop)
    this._turn = new Encoder(number, layout.turn)
    this._river = new Encoder(number, layout.river)
  }

  encode(playersInvolved) {
    var bits = 0
    bits |= this._flop.encode(playersInvolved.flop)
    bits |= this._turn.encode(playersInvolved.turn)
    bits |= this._river.encode(playersInvolved.river)
    return bits
  }

  decode(bits) {
    return {
      flop  : this._flop.decode(bits)
    , turn  : this._turn.decode(bits)
    , river : this._river.decode(bits)
    }
  }
}

const playersInvolvedEncoder = new PlayersInvolvedEncoder()

const ALL_ZERO = { flop: 0, turn: 0, river: 0 }
function encode(playersInvolved) {
  playersInvolved = Object.assign({}, ALL_ZERO, playersInvolved)
  const bits = playersInvolvedEncoder.encode(playersInvolved)
  return encode3(bits)
}

function decode(s) {
  assert.equal(s.length, 3)
  const bits = decode3(s)
  return playersInvolvedEncoder.decode(bits)
}

module.exports = { encode, decode, words: 3 }
