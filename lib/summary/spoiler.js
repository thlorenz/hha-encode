'use strict'

const assert = require('assert')
const PositionEncoder = require('../encoder.position')
const CardsEncoder = require('cards-52-encoder/lib/encoder.cards')
const { bitsToLayout } = require('../util')
const { encode3, decode3 } = require('6bit-encoder')

/*
Very similar to hero, but without the stack ratio
| Position | cards  | _total_
| 0000  (4)|  (12)  |   18
*/

/* eslint-disable comma-spacing */
const layout = bitsToLayout([
    [ 'cards'       , 12 ]
  , [ 'pos'         ,  4 ]
])

class SpoilerEncoder {
  constructor() {
    this._pos = new PositionEncoder(layout.pos)
    this._cards = new CardsEncoder(layout.cards, 2)
  }

  encode(spoiler) {
    const cards = spoiler.cards == null ? {} : spoiler.cards
    var bits = 0
    bits |= this._pos.encode(spoiler.pos)
    bits |= this._cards.encode([ cards.card1, cards.card2 ])
    return bits
  }

  decode(b) {
    const cardsArr = this._cards.decode(b)
    return {
        pos: this._pos.decode(b)
      , cards: { card1: cardsArr[0], card2: cardsArr[1] }
    }
  }
}

const spoilerEncoder = new SpoilerEncoder()

function encode(spoiler) {
  const bs = spoilerEncoder.encode(spoiler)
  return encode3(bs)
}

function decode(s) {
  assert.equal(s.length, 3)

  const bs = decode3(s)
  return spoilerEncoder.decode(bs)
}

module.exports = { encode, decode, words: 3 }
