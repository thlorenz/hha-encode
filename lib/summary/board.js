'use strict'

const assert = require('assert')
const CardsEncoder = require('../encoder.cards')
const { encode5, decode5 } = require('6bit-encoder')

/*
| card1 | card2 | card3 | card4 | card2 |  _total_
|   6   |   6   |   6   |   6   |   6   |   30
*/

// Encoding cards not present as ?? by setting it to null

const cardsEncoder = new CardsEncoder([ 0 ], 5)

function encode(cards) {
  cards = cards == null ? {} : cards
  const arr = [ cards.card1, cards.card2, cards.card3, cards.card4, cards.card5 ]
  const bs = cardsEncoder.encode(arr)
  return encode5(bs)
}

function decode(s) {
  assert.equal(s.length, 5)

  const bs = decode5(s)
  const arr = cardsEncoder.decode(bs)
  return { card1: arr[0], card2: arr[1], card3: arr[2], card4: arr[3], card5: arr[4] }
}

module.exports = { encode, decode, words: 5 }
