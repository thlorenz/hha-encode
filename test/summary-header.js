'use strict'

const test = require('tape')
const spok = require('spok')

const { encode, decode } = require('../lib/summary/header')

test('\nround tripping header 1', function(t) {
  const original = {
    room      : 'ignition',
    gametype  : 'tournament',
    currency  : '$',
    pokertype : 'holdem',
    limit     : 'fixedlimit',
    level     : 'xi',
    maxseats  : 9,
    donation  : 0.91,
    rake      : 0.09,
    sb        : 400,
    bb        : 800,
    ante      : 50
  }

  const encoded = encode(original)
  const decoded = decode(encoded)
  spok(t, decoded, original)

  t.end()
})

test('\nround tripping header 2', function(t) {
  const original = {
    room      : 'pokerstars',
    gametype  : 'cashgame',
    currency  : '$',
    pokertype : 'holdem',
    limit     : 'nolimit',
    maxseats  : 6,
    donation  : 0.01,
    rake      : 0.01,
    sb        : 500000000,
    bb        : 1000000000,
    ante      : 400000
  }

  const encoded = encode(original)
  const decoded = decode(encoded)
  spok(t, decoded, original)

  t.end()
})
