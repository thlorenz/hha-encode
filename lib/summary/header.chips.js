'use strict'

const {
    ChipsTranslator
  , bitsToLayout
} = require('../util')

// all chips take 10 bits
/* eslint-disable comma-spacing */
const bits = [
    [ 'donation' , 11 ]
  , [ 'rake'     , 11 ]
  , [ 'sb'       , 11 ]
  , [ 'bb'       , 11 ]
  , [ 'ante'     , 11 ]
]
const layout = bitsToLayout(bits)

class HeaderChips {
  constructor() {
    this._donation = new ChipsTranslator(layout.donation)
    this._rake = new ChipsTranslator(layout.rake)
    this._sb = new ChipsTranslator(layout.sb)
    this._bb = new ChipsTranslator(layout.bb)
    this._ante = new ChipsTranslator(layout.ante)
  }

  encode(header) {
    var bits = 0
    bits |= this._donation.encode(header.donation)
    bits |= this._rake.encode(header.rake)
    bits |= this._sb.encode(header.sb)
    bits |= this._bb.encode(header.bb)
    bits |= this._ante.encode(header.ante)
    return bits
  }

  decode(bits) {
    return {
      donation : this._donation.decode(bits)
    , rake     : this._rake.decode(bits)
    , sb       : this._sb.decode(bits)
    , bb       : this._bb.decode(bits)
    , ante     : this._ante.decode(bits)
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

const bs = headerChips.encode(headerSample)
const dec = headerChips.decode(bs)
console.log({ len: bs.toString(2).length, bits: bs.toString(2), dec })
