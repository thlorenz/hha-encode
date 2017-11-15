'use strict'

// As an annoying note bitshifting only works for up to 31 bit ints
// https://stackoverflow.com/a/307200/97443
// Therefore we'll use a max-word of 30bits which works out to 5 digits of our base64 encoding.
// This means each record needs to be limited to that size.

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

function bin(n, nbits = 32) {
  return n.toString(2).padStart(nbits, '0')
}

function isolate(bits, idx, len) {
  return (bits >> idx) & maskForBits(len)
}

module.exports = {
    dectoen
  , number
  , bitsToLayout
  , isolate
  , maskForBits
  , shiftMask
  , bin
}
