'use strict'

const assert = require('assert')
const BlindsTranslator = require('../translator.blinds')
const Translator = require('../translator')
const CardsTranslator = require('../translator.cards')
const { bitsToLayout } = require('../util')
const { encode5, decode5 } = require('../url-safe-base64.js')
const { positions, positionsSet } = require('../constants')

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
    this._pos = new Translator(positions, layout.pos)
    this._cards = new CardsTranslator(layout.cards, 2)
    this._stackRatio = new BlindsTranslator(layout.stackRatio, 14)
  }

  encode(hero) {
    var bits = 0
    var p = hero.pos.toUpperCase().trim()
    // normalize all cases of unavailble positions to n/a
    p = positionsSet.has(p) ? p : 'N/A'

    const cards = hero.cards || {}

    bits |= this._pos.encode(p)
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

module.exports = { encode, decode }
