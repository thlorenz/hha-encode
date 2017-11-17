'use strict'

const { isolate } = require('./util')

class BlindsEncoder {
  // round number to 1 decimal, i.e. 5.6 BBs
  // store it as integer by multiplying by 10
  // 14 bits -> 0.0 - 1638.3
  // 15 bits -> 0.0 - 3276.7
  constructor([ idx ], bitLength) {
    this._idx = idx
    this._bitLength = bitLength
    this._maxValue = (1 << bitLength) - 1
  }

  encode(n) {
    // make 10.2 into 102 but ensure we can still fit into the allocated
    // space. If not choose the largest possible number we can fit.
    // At all costs avoid taking up more bits than we are assigned
    const bits = Math.min(Math.round(n * 10), this._maxValue)
    const allBits = bits << this._idx
    return allBits
  }

  decode(allBits) {
    const bits = isolate(allBits, this._idx, this._bitLength)
    return bits / 10
  }
}

module.exports = BlindsEncoder
