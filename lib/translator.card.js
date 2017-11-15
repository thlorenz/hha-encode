'use strict'

const { isolate } = require('./util')

const ranks = [ 'A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2' ]
const suits = [ 'h', 'c', 'd', 's' ]

const cards = []
const cardIndexes = new Map()
for (const r of ranks) {
  for (const s of suits) {
    const idx = cards.length
    const card = r + s
    cards.push(card)
    cardIndexes.set(card, idx)
  }
}

// 52 different cards, so we need 6 bits to encode one == one base64 char
class CardTranslator {
  constructor([ idx ]) {
    this._idx = idx
  }

  encode(card) {
    const bits = cardIndexes.get(card)
    const allBits = bits << this._idx
    return allBits
  }

  decode(allBits) {
    const bits = isolate(allBits, this._idx, 6)
    return cards[bits]
  }
}

module.exports = CardTranslator
