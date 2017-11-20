'use strict'

const assert = require('assert')
const PositionEncoder = require('../encoder.position')
const BlindsEncoder = require('../encoder.blinds')
const Encoder = require('../encoder')
const { bitsToLayout, number } = require('../util')
const { encode: bencode, decode: bdecode, decodeFor, encodeFor } = require('6bit-encoder')

/*
  Three types of actions.
  The type field is word aligned to 6 bits so we can parse it in isolation.

 ## Type 1

  raise|call|bet + amountBB

  | type    |  position |  bb | __total__
  |  6      |     4     |  14 |    24

 ## Type 2

  check | fold

  | type    |  position | __total__ |
  |  6      |     4     |    10     |

## Type 3

  folds + count (1 - 10) .. aligned number to word (4 would be enough)

  | type    | number  | __total__ |
  |  6      |    6    |    10     |

*/

const actionTypes = [
  'raise', 'call', 'bet', 'check', 'fold', 'folds'
]

const actionTypesMap = new Map()
for (var i = 0; i < actionTypes.length; i++) {
  actionTypesMap.set(actionTypes[i], i)
}

// layouts omit type since we consume that separately
/* eslint-disable comma-spacing */
const layout1 = bitsToLayout([
    [ 'amountBB',   14 ]
  , [ 'pos'     ,    4 ]
]) // 3 chars

const layout2 = bitsToLayout([
  [ 'pos',   4 ]
]) // 1 char

const layout3 = bitsToLayout([
    [ 'number', 6 ]
  , [ 'pos',   4 ]
]) // 2 chars

class ActionWithBBEncoder {
  constructor() {
    this._amountBB = new BlindsEncoder(layout1.amountBB, 14)
    this._pos = new PositionEncoder(layout1.pos)
  }

  encode({ amountBB, pos }) {
    var bits = 0
    bits |= this._amountBB.encode(amountBB)
    bits |= this._pos.encode(pos)
    return bits
  }

  decode(bits) {
    const amountBB = this._amountBB.decode(bits)
    const pos = this._pos.decode(bits)
    return { amountBB, pos }
  }
}

class ActionWithoutBBEncoder {
  constructor() {
    this._pos = new PositionEncoder(layout2.pos)
  }

  encode({ pos }) {
    var bits = 0
    bits |= this._pos.encode(pos)
    return bits
  }

  decode(bits) {
    const pos = this._pos.decode(bits)
    return { pos }
  }
}

class MultipleFoldsEncoder {
  constructor() {
    this._number = new Encoder(number, layout3.number)
  }

  encode({ number }) {
    var bits = 0
    bits |= this._number.encode(number)
    return bits
  }

  decode(bits) {
    const number = this._number.decode(bits)
    return { number }
  }
}

const actionWithBBEncoder = new ActionWithBBEncoder()
const actionWithoutBBEncoder = new ActionWithoutBBEncoder()
const multileFoldsEncoder = new MultipleFoldsEncoder()

function actionEncoder(typeIdx) {
  return (
      typeIdx < 3 ? actionWithBBEncoder
    : typeIdx < 5 ? actionWithoutBBEncoder
    : multileFoldsEncoder
  )
}

function consumedChars(typeIdx) {
  return (
      typeIdx < 3 ? 3
    : typeIdx < 5 ? 1
    : 2
  )
}

const READ_PAST = 'read past action string '

function encodeAction(action) {
  const type = action.type
  const typeBits = actionTypesMap.get(type)
  const typeChar = bencode(typeBits)

  const encoder = actionEncoder(typeBits)
  const charsNeeded = consumedChars(typeBits)
  const actionEncoded = encoder.encode(action)
  const actionChars = encodeFor(charsNeeded)(actionEncoded)
  return typeChar + actionChars
}

function decode(s) {
  const actions = []
  // walking char by char and deciding by first char how to proceed for each action
  const len = s.length
  var idx = 0
  while (idx < s.length) {
    const typeChar = s[idx++]
    const typeIdx = bdecode(typeChar)
    const type = actionTypes[typeIdx]

    const charsNeeded = consumedChars(typeIdx)
    assert(idx + charsNeeded <= len, READ_PAST + s)

    const encoder = actionEncoder(typeIdx)
    const chars = s.slice(idx, (idx += charsNeeded))
    const bits = decodeFor(charsNeeded)(chars)

    const action = Object.assign({ type }, encoder.decode(bits))
    actions.push(action)
  }
  return actions
}

function encode(actions) {
  var s = ''
  if (actions == null) return s
  for (const action of actions) {
    s += encodeAction(action)
  }
  return s
}

module.exports = { encode, decode }
