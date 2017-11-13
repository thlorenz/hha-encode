'use strict'

// As an annoying note bitshifting only works for up to 31 bit ints
// https://stackoverflow.com/a/307200/97443

function dectoen(arr) {
  const map = new Map()
  for (var i = 0; i < arr.length; i++) {
    map.set(arr[i], i)
  }
  return map
}

function maskForBits(n) {
  return (0b1 << n) - 1
}

function bitsToLayout(bits) {
  var idx = 0
  const map = {}
  for (const [ name, b ] of bits) {
    const mask = maskForBits(b)
    map[name] = [ idx, mask ]
    idx += b
  }
  return map
}

function shiftMask(n, digits, mask) {
  const shifted = n >> digits
  return shifted & mask
}

const number = []
for (var i = 0; i < 1000; i++) {
  number[i] = i
}

function identity(x) {
  return x
}

class Translator {
  constructor(decodeArray, [ bitIdx, mask ], preEncode = identity, postDecode = identity) {
    this._decodeArray = decodeArray
    this._encodeMap = dectoen(decodeArray)
    this._bitIdx = bitIdx
    this._mask = mask
    this._preEncode = preEncode
    this._postDecode = postDecode
  }

  encode(item) {
    const encodeIdx = this._encodeMap.get(this._preEncode(item))
    return encodeIdx << this._bitIdx
  }

  decode(bits) {
    const decodeIdx = shiftMask(bits, this._bitIdx, this._mask)
    return this._postDecode(this._decodeArray[decodeIdx])
  }
}

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

function bin(n, nbits = 53) {
  return n.toString(2).padStart(nbits, '0')
}

function safeToShift(nleft) {
  return nleft <= 31
}

function isolate(bits, idx, len) {
  return (bits >> idx) & maskForBits(len)
}

function isolateFactor(bits, factor, len) {
  console.log({ factor: bin(factor) })
  return (bits / (factor / 2)) & maskForBits(len)
}

class ChipsTranslator {
  // | digits  | zeros |
  // | 0000000 | 0000  |
  // |   7     |   4   |
  constructor([ idx ]) {
    this._idx = idx
    this._shift = safeToShift(idx)
    if (!this._shift) this._factor = Math.pow(2, idx)
  }

  encode(n) {
    // make 1.50 into 150
    n = Math.round(n * 100)
    // separate into highest 2 digits and number of zeroes
    const [ digits, zeros ] = separateZeros(n)
    const bits = (digits << 4) | zeros
    const allBits = this._shift ? bits << this._idx : bits * this._factor
    // console.log({ encodeBits: bin(bits, 11), allBits: bin(allBits), idx: this._idx, n: n / 100 })
    return allBits
  }

  decode(allBits) {
    const bits = this._shift
      ? isolate(allBits, this._idx, 11)
      : isolateFactor(allBits, this._factor, 11)

    console.log({ all: bin(allBits), bits: bin(bits, 11) })

    const zeros = shiftMask(bits, 0, chipsZerosMask)
    const digits = shiftMask(bits, 4, chipsDigitsMask)
    var n = zeros > 0 ? (digits * Math.pow(10, zeros)) : digits
    return n / 100
  }
}

module.exports = {
    dectoen
  , number
  , bitsToLayout
  , isolate
  , Translator
  , ChipsTranslator
}
