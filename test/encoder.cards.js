'use strict'

const test = require('tape')
const spok = require('spok')
// eslint-disable-next-line no-unused-vars
const ocat = require('./util/ocat')
// eslint-disable-next-line no-unused-vars
const { bin } = require('../lib/util')

const CardsEncoder = require('../lib/encoder.cards')

function roundtrip(t, original) {
  const len = original.length
  const encoder = new CardsEncoder([ 0 ], len)
  const encoded = encoder.encode(original)
  const decoded = encoder.decode(encoded)
  original.$topic = `${len} cards`
  spok(t, decoded, original)
}

test('\nround tripping multiple cards including missing ones', function(t) {
  roundtrip(t, [ 'Ks', 'Th' ])
  roundtrip(t, [ 'As', 'Ad', 'Ks' ])
  roundtrip(t, [ 'Td', 'Js', 'Kc' ])
  roundtrip(t, [ '2d', '5c', 'Js', '8h' ])
  roundtrip(t, [ '2d', '??', '5c', 'Js', '8h' ])
  t.end()
})

test('\npassing null or other invalid card i.e. it was not present', function(t) {
  const original = [ 'Ks', null, 'N/A', '?', '??' ]
  const expected = [ 'Ks', '??', '??', '??', '??' ]

  const encoder = new CardsEncoder([ 0 ], original.length)
  const encoded = encoder.encode(original)
  const decoded = encoder.decode(encoded)

  spok(t, decoded, expected)
  t.end()
})

test('\ntwo cards in center of 24 bytes', function(t) {
  //          |23-18|17-12| 11-6| 5-0 |
  var bits = 0b000000000000000000000000
  const original = [ 'As', 'Kd' ]
  const encoder = new CardsEncoder([ 6 ], 2)
  bits |= encoder.encode(original)
  t.equal(bits, 0b000000000110000011000000, 'encodes card in the center')
  const decoded = encoder.decode(bits)
  spok(t, decoded, original)
  t.end()
})
