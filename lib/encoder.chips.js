'use strict'

const { isolate, maskForBits, shiftMask } = require('./util')

function separateZeros(n, digitMask) {
  if (n === 0) return [ 0, 0 ]
  var counter = 0
  // force max digits that fit in digit bits, i.e. treat 5,400,100 as 5,400,000
  while (n % 10 === 0 || n > digitMask) {
    counter++
    n /= 10
  }
  n = Math.round(n)
  return [ n, counter ]
}

const chipsZerosMask = maskForBits(4)

class ChipsEncoder {
  // | digits     | zeros |
  // | 0000000    | 0000  |
  // |  digitBits |   4   |
  constructor([ idx ], digitBits = 7) {
    this._idx = idx
    this._digitBits = digitBits
    this._digitMask = maskForBits(digitBits)
  }

  encode(n) {
    // make 1.50 into 150
    n = Math.round(n * 100)
    // separate into highest 2 digits and number of zeroes
    const [ digits, zeros ] = separateZeros(n, this._digitMask)
    const bits = (digits << 4) | zeros
    const allBits = bits << this._idx
    return allBits
  }

  decode(allBits) {
    const bits = isolate(allBits, this._idx, this._digitBits + 4)

    const zeros = shiftMask(bits, 0, chipsZerosMask)
    const digits = shiftMask(bits, 4, this._digitMask)
    var n = zeros > 0 ? (digits * Math.pow(10, zeros)) : digits
    return n / 100
  }
}

module.exports = ChipsEncoder
