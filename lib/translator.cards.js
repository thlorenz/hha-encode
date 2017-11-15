'use strict'

const assert = require('assert')
const CardTranslator = require('./translator.card')
const { isolate } = require('./util')

class CardsTranslator {
  constructor([ idx ], n) {
    this._idx = idx
    this._cardTranslators = []
    this._n = n

    for (var i = 0; i < n; i++) {
      // one card takes up 6 bits
      this._cardTranslators.push(new CardTranslator([ i * 6 ]))
    }
  }

  encode(cards) {
    assert.equal(cards.length, this._n, 'amount of cards not matching cards tranlator spec')
    var bits = 0
    for (var i = 0; i < this._n; i++) {
      bits |= this._cardTranslators[i].encode(cards[i])
    }
    const allBits = bits << this._idx
    return allBits
  }

  decode(allBits) {
    const cards = []
    const bits = isolate(allBits, this._idx, this._n * 6)
    for (var i = 0; i < this._n; i++) {
      cards[i] = this._cardTranslators[i].decode(bits)
    }
    return cards
  }
}

module.exports = CardsTranslator
