const test = require('tape')
const spok = require('spok')

const { encode, decode } = require('../lib/summary/spoilers')

function roundtrip(t, original) {
  const encoded = encode(original)
  const decoded = decode(encoded)
  spok(t, decoded, original)
}

test('\nsummary:spoilers: rountrip', function(t) {
  roundtrip(t,
    [ { pos: 'CO', cards: { card1: 'Td', card2: 'Tc' } },
      { pos: 'BU', cards: { card1: 'Qs', card2: 'Jh' } } ])

  roundtrip(t,
    [ { pos: 'CO', cards: { card1: 'Td', card2: 'Tc' } },
      { pos: 'SB', cards: { card1: 'Kd', card2: 'Tc' } },
      { pos: 'BB', cards: { card1: 'Ad', card2: 'Ac' } },
      { pos: 'BU', cards: { card1: 'Qs', card2: 'Jh' } } ])
  t.end()
})
