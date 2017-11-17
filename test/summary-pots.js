'use strict'

const test = require('tape')
const spok = require('spok')

const { encode, decode } = require('../lib/summary/pots')

function roundtrip(t, original, extra = {}) {
  const encoded = encode(original)
  const decoded = decode(encoded)
  spok(t, decoded, Object.assign(original, extra))
}

test('\nsummary-pots: roundtripping scenarios', function(t) {
  roundtrip(t, { $topic: 'all given', flop: 22.3, turn: 43.1, river: 50.0, total: 66.7 })
  roundtrip(t, { $topic: 'missing total and river', flop: 22.3, turn: 43.1 }, { river: 0, total: 0 })
  roundtrip(t, { $topic: 'missing flop', turn: 43.1, river: 50.0, total: 66.7 }, { flop: 0 })
  t.end()
})
