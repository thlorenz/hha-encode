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

// card not present
const CARD_NOT_PRESENT = '??'
cardIndexes.set(CARD_NOT_PRESENT, cards.length)
cards.push(CARD_NOT_PRESENT)

// 52 different cards, so we need 6 bits to encode one == one base64 char
class CardEncoder {
  constructor([ idx ]) {
    this._idx = idx
  }

  encode(card) {
    if (card == null || !cardIndexes.has(card)) card = CARD_NOT_PRESENT
    const bits = cardIndexes.get(card)
    const allBits = bits << this._idx
    return allBits
  }

  decode(allBits) {
    const bits = isolate(allBits, this._idx, 6)
    return cards[bits]
  }
}

module.exports = CardEncoder
module.exports.CARD_NOT_PRESENT = CARD_NOT_PRESENT
