'use strict'

const test = require('tape')

const ChipsEncoder = require('../lib/encoder.chips')

function roundtrip(t, original, expected = null, digitBits = 7) {
  if (!expected) expected = original
  const encoder = new ChipsEncoder([ 0 ], digitBits)
  const encoded = encoder.encode(original)
  const decoded = encoder.decode(encoded)
  t.equal(decoded, expected, `${original} => ${expected}`)
}

test('\nencoder:chips: round tripping some chips with default digit bits', function(t) {
  roundtrip(t, 1)
  roundtrip(t, 3.2)
  roundtrip(t, 3.1)
  roundtrip(t, 3.14, 3.1)
  roundtrip(t, 3.19, 3.2)
  roundtrip(t, 100)
  roundtrip(t, 101)
  t.end()
})

test('\nencoder:chips: round tripping some chips with increased digit bits', function(t) {
  roundtrip(t, 1, null, 10)
  roundtrip(t, 3.2, null, 10)
  roundtrip(t, 3.1, null, 10)
  roundtrip(t, 3.14, null, 10)
  roundtrip(t, 3.19, null, 10)
  roundtrip(t, 100, null, 10)
  roundtrip(t, 101, null, 10)
  t.end()
})
