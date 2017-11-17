'use strict'

const test = require('tape')
const spok = require('spok')
// eslint-disable-next-line no-unused-vars
const ocat = require('./util/ocat')

const { encode, decode } = require('../lib/summary/board')

function roundtrip(t, arr) {
  const original = { card1: arr[0], card2: arr[1], card3: arr[2], card4: arr[3], card5: arr[4] }
  const encoded = encode(original)
  const decoded = decode(encoded)
  spok(t, decoded, original)
}

test('\nsummary:board: round tripping multiple cards including missing ones', function(t) {
  roundtrip(t, [ '2d', '5c', 'Js', '8h', '5h' ])
  roundtrip(t, [ '2d', '??', '5c', 'Js', '5h' ])
  t.end()
})

test('\nsummary:board: given flop only', function(t) {
  const original = { card1: '2h', card2: 'Ah', card3: 'Ad' }
  const encoded = encode(original)
  const decoded = decode(encoded)
  const expected = Object.assign({}, original, { card4: '??', card5: '??' })
  spok(t, decoded, expected)
  t.end()
})

test('\nsummary:board: given empty object', function(t) {
  const encoded = encode({})
  const decoded = decode(encoded)
  const expected = { card1: '??', card2: '??', card3: '??', card4: '??', card5: '??' }
  spok(t, decoded, expected)
  t.end()
})

test('\nsummary:board: given null', function(t) {
  const encoded = encode(null)
  const decoded = decode(encoded)
  const expected = { card1: '??', card2: '??', card3: '??', card4: '??', card5: '??' }
  spok(t, decoded, expected)
  t.end()
})
