'use strict'

const {
    ChipsTranslator
  , bitsToLayout
} = require('../util')

// all chips take 10 bits
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
module.exports = headerChips

const headerSample = {
  room: 'ignition',
  gametype: 'tournament',
  currency: '$',
  pokertype: 'holdem',
  limit: 'nolimit',
  level: 'xi',
  maxseats: 9,
  donation: 0.91,
  rake: 0.09,
  sb: 400,
  bb: 800,
  ante: 50
}

// 1011011 0000

const [ b1, b2, b3 ] = headerChips.encode(headerSample)
const dec = headerChips.decode(b1, b2, b3)
console.log({ dec })
