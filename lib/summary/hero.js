'use strict'

const assert = require('assert')
const BlindsEncoder = require('../encoder.blinds')
const PositionEncoder = require('../encoder.position')
const CardsEncoder = require('cards-52-encoder/lib/encoder.cards')
const { bitsToLayout } = require('../util')
const { encode5, decode5 } = require('6bit-encoder')

/*
| Position | cards  |  stackRatioBB | _total_
| 0000  (4)|  (12)  |   (14)        |  30
*/

/* eslint-disable comma-spacing */
const layout = bitsToLayout([
    [ 'stackRatio'  , 14 ]
  , [ 'cards'       , 12 ]
  , [ 'pos'         ,  4 ]
])

class Hero {
  constructor() {
    this._pos = new PositionEncoder(layout.pos)
    this._cards = new CardsEncoder(layout.cards, 2)
    this._stackRatio = new BlindsEncoder(layout.stackRatio, 14)
  }

  encode(hero) {
    var bits = 0
    const cards = hero.cards || {}

    bits |= this._pos.encode(hero.pos)
    bits |= this._cards.encode([ cards.card1, cards.card2 ])
    bits |= this._stackRatio.encode(hero.stackRatio)
    return bits
  }

  decode(b) {
    const cardsArr = this._cards.decode(b)
    return {
        pos: this._pos.decode(b)
      , cards: { card1: cardsArr[0], card2: cardsArr[1] }
      , stackRatio: this._stackRatio.decode(b)
    }
  }
}

const hero = new Hero()

function encode(hi) {
  const bs = hero.encode(hi)
  return encode5(bs)
}

function decode(s) {
  assert.equal(s.length, 5)

  const bs = decode5(s)
  return hero.decode(bs)
}

module.exports = { encode, decode, words: 5 }
