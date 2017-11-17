'use strict'

const assert = require('assert')
const { encode2, decode2, encode4, decode4, encode5, decode5 } = require('../url-safe-base64.js')

const { bitsToLayout } = require('../util')
const  ChipsEncoder = require('../encoder.chips')

// all chips take 11 bits except donation 19 bits (15 for digits + 4 for zeros)
/* eslint-disable comma-spacing */
const bits1 = [         // 5 words
    [ 'donation' , 19 ]
  , [ 'rake'     , 11 ]
]
const bits2 = [         // 4 words
    [ 'sb'       , 11 ]
  , [ 'bb'       , 11 ]
]
const bits3 = [         // 2 words
  [ 'ante'     , 11 ]
]

const words = 5 + 4 + 2

const layout1 = bitsToLayout(bits1)
const layout2 = bitsToLayout(bits2)
const layout3 = bitsToLayout(bits3)

class HeaderChips {
  constructor() {
    this._donation = new ChipsEncoder(layout1.donation, 15)
    this._rake = new ChipsEncoder(layout1.rake)
    this._sb = new ChipsEncoder(layout2.sb)
    this._bb = new ChipsEncoder(layout2.bb)
    this._ante = new ChipsEncoder(layout3.ante)
  }

  encode(header) {
    var bits1 = 0
    var bits2 = 0
    var bits3 = 0
    bits1 |= this._donation.encode(header.donation)
    bits1 |= this._rake.encode(header.rake)
    bits2 |= this._sb.encode(header.sb)
    bits2 |= this._bb.encode(header.bb)
    bits3 |= this._ante.encode(header.ante)
    return [ bits1, bits2, bits3 ]
  }

  decode(bits1, bits2, bits3) {
    return {
      donation : this._donation.decode(bits1)
    , rake     : this._rake.decode(bits1)
    , sb       : this._sb.decode(bits2)
    , bb       : this._bb.decode(bits2)
    , ante     : this._ante.decode(bits3)
    }
  }
}

const headerChips = new HeaderChips()

function encode(hc) {
  const [ bits1, bits2, bits3 ] = headerChips.encode(hc)

  const res = encode5(bits1) + encode4(bits2) + encode2(bits3)
  assert.equal(res.length, words)
  return res
}

function decode(s) {
  assert.equal(s.length, words)

  const enc1 = s.slice(0, 5)
  const enc2 = s.slice(5, 9)
  const enc3 = s.slice(9, 12)
  return headerChips.decode(
      decode5(enc1)
    , decode4(enc2)
    , decode2(enc3)
  )
}

module.exports = { encode, decode, words }
