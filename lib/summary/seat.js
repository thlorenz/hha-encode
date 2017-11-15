'use strict'

const assert = require('assert')
const BlindsEncoder = require('../encoder.blinds')
const Encoder = require('../encoder')
const { bitsToLayout } = require('../util')
const { encode3, decode3 } = require('../url-safe-base64.js')
const { positions, positionsSet } = require('../constants')

/*
| Position | chipsBB | _total_
| 0000  (4)|  (14)   |  18
*/

/* eslint-disable comma-spacing */
const layout = bitsToLayout([
    [ 'chipsBB' , 14 ]
  , [ 'pos'     ,  4 ]
])

class Seat {
  constructor() {
    this._pos = new Encoder(positions, layout.pos)
    this._chipsBB = new BlindsEncoder(layout.chipsBB, 14)
  }

  encode(seat) {
    var bits = 0
    var p = seat.pos.toUpperCase().trim()
    // normalize all cases of unavailble positions to n/a
    p = positionsSet.has(p) ? p : 'N/A'

    bits |= this._pos.encode(p)
    bits |= this._chipsBB.encode(seat.chipsBB)
    return bits
  }

  decode(b) {
    return { pos: this._pos.decode(b), chipsBB: this._chipsBB.decode(b) }
  }
}

const seat = new Seat()

function encode(si) {
  const bs = seat.encode(si)
  return encode3(bs)
}

function decode(s) {
  assert.equal(s.length, 3)

  const bs = decode3(s)
  return seat.decode(bs)
}

module.exports = { encode, decode }
