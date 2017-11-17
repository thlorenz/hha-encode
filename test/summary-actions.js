'use strict'

const test = require('tape')
const spok = require('spok')

const { encode, decode } = require('../lib/summary/actions')

function roundtrip(t, original, extra = {}) {
  const encoded = encode(original)
  const decoded = decode(encoded)
  spok(t, decoded, Object.assign(original, extra))
}

test('\nsummary:actions: roundtripping all action types', function(t) {
  const actions = [
    { pos: 'CO', type: 'raise', amountBB: 12.8 },
    { pos: 'BU', type: 'call', amountBB: 222.2 },
    { pos: 'CO', type: 'bet', amountBB: 3 },
    { pos: 'CO', type: 'check' },
    { pos: 'UTG+1', type: 'fold' },
    { type: 'folds', number: 2 }
  ]
  roundtrip(t, actions)
  t.end()
})

test('\nsummary:actions empty', function(t) {
  const encoded = encode([])
  t.equal(encoded, '', 'empty string encoded for empty action')
  roundtrip(t, [], { $topic: 'empty' })
  t.end()
})
