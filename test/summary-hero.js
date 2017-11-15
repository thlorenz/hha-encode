const test = require('tape')
const spok = require('spok')
// eslint-disable-next-line no-unused-vars
const ocat = require('./util/ocat')

const { encode, decode } = require('../lib/summary/hero')

function roundtrip(t, original) {
  const encoded = encode(original)
  const decoded = decode(encoded)
  spok(t, decoded, original)
}

test('\nsummary:hero: roundtripping heros', function(t) {
  roundtrip(t, { pos: 'UTG+1', stackRatio: 22.4, cards: { card1: '2s', card2: '4c' } })
  roundtrip(t, { pos: 'SB', stackRatio: 212.0, cards: { card1: 'Ad', card2: 'As' } })
  roundtrip(t, { pos: 'LJ', stackRatio: 0.2, cards: { card1: '5h', card2: '7d' } })
  t.end()
})
