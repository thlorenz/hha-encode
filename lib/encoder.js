'use strict'

const { dectoen, shiftMask } = require('./util')

function identity(x) {
  return x
}

class Encoder {
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

module.exports = Encoder
