'use strict'

const test = require('tape')

const {
    encode
  , encode2
  , encode3
  , encode4
  , encode5
  , decode
  , decode2
  , decode3
  , decode4
  , decode5
} = require('../lib/url-safe-base64')

test('\nencoding 6 bit', function(t) {
  t.equal(encode(0b000000), '0')
  t.equal(encode(0b000001), '1')
  t.equal(encode(0b000011), '3')
  t.equal(encode(0b000111), '7')
  t.equal(encode(0b001111), 'F')
  t.equal(encode(0b011111), 'V')
  t.equal(encode(0b111111), '_')

  t.end()
})

test('\nencoding 12 bit', function(t) {
  t.equal(encode2(0b000000000000), '00')
  t.equal(encode2(0b000001000001), '11')
  t.equal(encode2(0b000011000011), '33')
  t.equal(encode2(0b000111000111), '77')
  t.equal(encode2(0b001111001111), 'FF')
  t.equal(encode2(0b011111011111), 'VV')
  t.equal(encode2(0b111111111111), '__')

  t.end()
})

test('\nencoding 18 bit', function(t) {
  t.equal(encode3(0b000000000000000000), '000')
  t.equal(encode3(0b000001000001000001), '111')
  t.equal(encode3(0b000011000011000011), '333')
  t.equal(encode3(0b000111000111000111), '777')
  t.equal(encode3(0b001111001111001111), 'FFF')
  t.equal(encode3(0b011111011111011111), 'VVV')
  t.equal(encode3(0b111111111111111111), '___')

  t.end()
})

test('\nencoding 24 bit', function(t) {
  t.equal(encode4(0b000000000000000000000000), '0000')
  t.equal(encode4(0b000001000001000001000001), '1111')
  t.equal(encode4(0b000011000011000011000011), '3333')
  t.equal(encode4(0b000111000111000111000111), '7777')
  t.equal(encode4(0b001111001111001111001111), 'FFFF')
  t.equal(encode4(0b011111011111011111011111), 'VVVV')
  t.equal(encode4(0b111111111111111111111111), '____')

  t.end()
})

test('\nencoding 30 bit', function(t) {
  t.equal(encode5(0b000000000000000000000000000000), '00000')
  t.equal(encode5(0b000001000001000001000001000001), '11111')
  t.equal(encode5(0b000011000011000011000011000011), '33333')
  t.equal(encode5(0b000111000111000111000111000111), '77777')
  t.equal(encode5(0b001111001111001111001111001111), 'FFFFF')
  t.equal(encode5(0b011111011111011111011111011111), 'VVVVV')
  t.equal(encode5(0b111111111111111111111111111111), '_____')

  t.end()
})

test('\nround tripping 6 bits', function(t) {
  [ 0b000000
  , 0b000001
  , 0b000011
  , 0b000111
  , 0b001111
  , 0b011111
  , 0b111111
  , 0b111101
  ].forEach(roundTrip)

  function roundTrip(n) {
    const encoded = encode(n)
    const decoded = decode(encoded)
    t.equal(decoded, n)
  }

  t.end()
})

test('\nround tripping 12 bits', function(t) {
  [ 0b000000000000
  , 0b000001000001
  , 0b000011000011
  , 0b000111000111
  , 0b001111001111
  , 0b011111011111
  , 0b111111111111
  , 0b101111111101
  ].forEach(roundTrip)

  function roundTrip(n) {
    const encoded = encode2(n)
    const decoded = decode2(encoded)
    t.equal(decoded, n)
  }

  t.end()
})

test('\nround tripping 18 bits', function(t) {
  [ 0b000000000000000000
  , 0b000001000001000001
  , 0b000011000011000011
  , 0b000111000111000111
  , 0b001111001111001111
  , 0b011111011111011111
  , 0b111111111111111111
  , 0b110111111110111101
  ].forEach(roundTrip)

  function roundTrip(n) {
    const encoded = encode3(n)
    const decoded = decode3(encoded)
    t.equal(decoded, n)
  }

  t.end()
})

test('\nround tripping 24 bits', function(t) {
  [ 0b000000000000000000000000
  , 0b000001000001000001000001
  , 0b000011000011000011000011
  , 0b000111000111000111000111
  , 0b001111001111001111001111
  , 0b011111011111011111011111
  , 0b111111111111111111111111
  , 0b101111110111111011111101
  ].forEach(roundTrip)

  function roundTrip(n) {
    const encoded = encode4(n)
    const decoded = decode4(encoded)
    t.equal(decoded, n)
  }

  t.end()
})

test('\nround tripping 30 bits', function(t) {
  [ 0b000000000000000000000000000000
  , 0b000001000001000001000001000001
  , 0b000011000011000011000011000011
  , 0b000111000111000111000111000111
  , 0b001111001111001111001111001111
  , 0b011111011111011111011111011111
  , 0b111111111111111111111111111111
  , 0b110111101111010001110111111110
  ].forEach(roundTrip)

  function roundTrip(n) {
    const encoded = encode5(n)
    const decoded = decode5(encoded)
    t.equal(decoded, n)
  }

  t.end()
})
