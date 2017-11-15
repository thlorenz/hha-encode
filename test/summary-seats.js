'use strict'

const test = require('tape')
const spok = require('spok')
// eslint-disable-next-line no-unused-vars
const ocat = require('./util/ocat')

const { encode, decode } = require('../lib/summary/seats')

test('\nencoding seats that do not exceed max BBs we can fit', function(t) {
  const original =
    [ { pos: 'SB', chipsBB: 19.3 },
      { pos: 'BB', chipsBB: 27.6 },
      { pos: 'UTG', chipsBB: 7.6 },
      { pos: 'UTG+1', chipsBB: 0.1 },
      { pos: 'MP', chipsBB: 0 },
      { pos: 'HJ', chipsBB: 999.9 },
      { pos: 'CO', chipsBB: 19.8 },
      { pos: 'BU', chipsBB: 17.6 } ]

  const encoded = encode(original)
  const decoded = decode(encoded)
  spok(t, decoded, original)

  t.end()
})

test('\nencoding seats with unavailable positions', function(t) {
  const original =
    [ { pos: 'N/A', chipsBB: 23.1 },
      { pos: 'undefined', chipsBB: 27.6 }
    ]

  const encoded = encode(original)
  const decoded = decode(encoded)
  spok(t, decoded,
    [ { pos: 'N/A', chipsBB: 23.1 }
    , { pos: 'N/A', chipsBB: 27.6 } ])

  t.end()
})

test('\nencoding seats with one BB exceeding what we can feed', function(t) {
  const original =
    [ { pos: 'BB', chipsBB: 23.1 },
      { pos: 'BU', chipsBB: 21227.6 }
    ]

  const encoded = encode(original)
  const decoded = decode(encoded)
  spok(t, decoded,
    [ { pos: 'BB', chipsBB: 23.1 }
    , { pos: 'BU', chipsBB: 1638.3 } ]) // corrected to max we can fit

  t.end()
})
