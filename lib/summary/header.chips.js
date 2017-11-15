'use strict'

const assert = require('assert')
const { encode2, decode2, encode4, decode4 } = require('../url-safe-base64.js')

const { bitsToLayout } = require('../util')
const  ChipsTranslator = require('../translator.chips')

// all chips take 11 bits
/* eslint-disable comma-spacing */
const bits1 = [
    [ 'donation' , 11 ]
  , [ 'rake'     , 11 ]
]
const bits2 = [
    [ 'sb'       , 11 ]
  , [ 'bb'       , 11 ]
]
const bits3 = [
  [ 'ante'     , 11 ]
]

const layout1 = bitsToLayout(bits1)
const layout2 = bitsToLayout(bits2)
const layout3 = bitsToLayout(bits3)

class HeaderChips {
  constructor() {
    this._donation = new ChipsTranslator(layout1.donation)
    this._rake = new ChipsTranslator(layout1.rake)
    this._sb = new ChipsTranslator(layout2.sb)
    this._bb = new ChipsTranslator(layout2.bb)
    this._ante = new ChipsTranslator(layout3.ante)
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
  return encode4(bits1) + encode4(bits2) + encode2(bits3)
}

function decode(s) {
  assert.equal(s.length, 10)

  const enc1 = s.slice(0, 4)
  const enc2 = s.slice(4, 8)
  const enc3 = s.slice(8, 11)
  return headerChips.decode(
      decode4(enc1)
    , decode4(enc2)
    , decode2(enc3)
  )
}

module.exports = { encode, decode }
