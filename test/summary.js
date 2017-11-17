const test = require('tape')
const spok = require('spok')
// eslint-disable-next-line no-unused-vars
const ocat = require('./util/ocat')

const { encode, decode } = require('../lib/summary/summary')

function roundtrip(t, original, exact = false) {
  const encoded = encode(original)
  const decoded = decode(encoded)
  spok(t, decoded, original)
  if (exact) spok(t, original, decoded)
}

test('\nsummary: pokerstars holdem tournament exact roundtrip', function(t) {
  const original = require('./fixtures/ps-holdem.summary.js')
  roundtrip(t, original, true)
  t.end()
})
