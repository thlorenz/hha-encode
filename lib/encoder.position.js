'use strict'

const { positions, POSITION_UNKNOWN } = require('./constants')
const { isolate } = require('./util')

const positionIndexes = new Map()
for (var i = 0; i < positions.length; i++) {
  positionIndexes.set(positions[i], i)
}

// position 0-9 == 4 bits
class PositionEncoder {
  constructor([ idx ]) {
    this._idx = idx
  }

  encode(pos) {
    pos = (pos == null ? POSITION_UNKNOWN : pos).trim().toUpperCase()
    if (!positionIndexes.has(pos)) pos = POSITION_UNKNOWN

    const bits = positionIndexes.get(pos)
    const allBits = bits << this._idx
    return allBits
  }

  decode(allBits) {
    const bits = isolate(allBits, this._idx, 4)
    return positions[bits]
  }
}

module.exports = PositionEncoder
