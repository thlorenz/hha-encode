'use strict'

const assert = require('assert')
const CardEncoder = require('./encoder.card')
const { isolate } = require('./util')

class CardsEncoder {
  constructor([ idx ], n) {
    this._idx = idx
    this._cardEncoders = []
    this._n = n

    for (var i = 0; i < n; i++) {
      // one card takes up 6 bits
      this._cardEncoders.push(new CardEncoder([ i * 6 ]))
    }
  }

  encode(cards) {
    assert.equal(cards.length, this._n, 'amount of cards not matching cards tranlator spec')
    var bits = 0
    for (var i = 0; i < this._n; i++) {
      bits |= this._cardEncoders[i].encode(cards[i])
    }
    const allBits = bits << this._idx
    return allBits
  }

  decode(allBits) {
    const cards = []
    const bits = isolate(allBits, this._idx, this._n * 6)
    for (var i = 0; i < this._n; i++) {
      cards[i] = this._cardEncoders[i].decode(bits)
    }
    return cards
  }
}

module.exports = CardsEncoder
