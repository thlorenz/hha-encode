'use strict'

const { isolate, maskForBits, shiftMask } = require('./util')

function separateZeros(n) {
  if (n === 0) return [ 0, 0 ]
  var counter = 0
  // force 2 digits, i.e. treat 5,400,100 as 5,400,000
  while (n % 10 === 0 || n > 99) {
    counter++
    n /= 10
  }
  return [ n, counter ]
}

const chipsZerosMask = maskForBits(4)
const chipsDigitsMask = maskForBits(7)

class ChipsEncoder {
  // | digits  | zeros |
  // | 0000000 | 0000  |
  // |   7     |   4   |
  constructor([ idx ]) {
    this._idx = idx
  }

  encode(n) {
    // make 1.50 into 150
    n = Math.round(n * 100)
    // separate into highest 2 digits and number of zeroes
    const [ digits, zeros ] = separateZeros(n)
    const bits = (digits << 4) | zeros
    const allBits = bits << this._idx
    return allBits
  }

  decode(allBits) {
    const bits = isolate(allBits, this._idx, 11)

    const zeros = shiftMask(bits, 0, chipsZerosMask)
    const digits = shiftMask(bits, 4, chipsDigitsMask)
    var n = zeros > 0 ? (digits * Math.pow(10, zeros)) : digits
    return n / 100
  }
}

module.exports = ChipsEncoder
