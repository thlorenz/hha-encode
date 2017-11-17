'use strict'
/* eslint-disable yoda */

const { isolate } = require('./util')
const assert = require('assert')
const ENCODE_OUTOFBOUNDS = 'The number to be encoded is out of bounds '
const SEPARATOR = '*'

function getDecodingTable(arr) {
  const map = new Map()
  for (var i = 0; i < arr.length; i++) {
    map.set(arr[i], i)
  }
  return map
}

// Based on: https://stackoverflow.com/a/40415059/97443 the following are safe
// A-Z a-z 0-9 - . _ ~ ( ) ' ! * : @ ,
// safe+unsafe: ; $ - _ . + ! * ' ( ),
// Also see: http://www.blooberry.com/indexdot/html/topics/urlencoding.htm
// Two major differences to standard base64: (http://www.motobit.com/util/wiki/Base64)
//  - number digits are encoded at correct index, thus that they don't need to be encoded/decoded
//  - idxs 62 and 63 have been changed to characters that are url safe (from + and =)
const encodingTable = [
  '0', '1', '2', '3', '4', '5', '6', '7',   // 00-07
  '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',   // 08-15
  'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',   // 16-23
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',   // 24-31
  'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd',   // 32-39
  'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',   // 40-47
  'm', 'n', 'o', 'p', 'q', 'r', 's', 't',   // 48-55
  'u', 'v', 'w', 'x', 'y', 'z', '-', '_',   // 56-63
  SEPARATOR                                 // 64 (separator)
]

const decodingTable = getDecodingTable(encodingTable)

function decode(s) {
  assert.equal(s.length, 1)
  return decodingTable.get(s)
}

function decode2(s) {
  assert.equal(s.length, 2)
  const [ upper, lower ] = s
  return (decode(upper) << 6) | decode(lower)
}

function decode3(s) {
  assert.equal(s.length, 3)
  const [ upper, mid, lower ] = s
  return (decode(upper) << 12) | (decode(mid) << 6) | decode(lower)
}

function decode4(s) {
  assert.equal(s.length, 4)
  const [ upper, belowUpper, aboveLower, lower ] = s
  return (decode(upper) << 18) | (decode(belowUpper) << 12)
    | (decode(aboveLower) << 6) | decode(lower)
}

function decode5(s) {
  assert.equal(s.length, 5)
  const [ upper, belowUpper, mid, aboveLower, lower ] = s
  return (decode(upper) << 24) | (decode(belowUpper) << 18)
    | (decode(mid) << 12) | (decode(aboveLower) << 6) | decode(lower)
}

function encode(n) {
  assert(0 <= n && n <= 0x3f, ENCODE_OUTOFBOUNDS + n)
  // 6 bits -> 1 digit
  return encodingTable[n]
}

function encode2(n) {
  assert(0 <= n && n <= 0xfff, ENCODE_OUTOFBOUNDS + n)
  // 12 bits -> 2 digits
  const lower = isolate(n, 0, 6)
  const upper = isolate(n, 6, 6)
  return encode(upper) + encode(lower)
}

function encode3(n) {
  assert(0 <= n && n <= 0x3ffff, ENCODE_OUTOFBOUNDS + n)
  // 18 bits -> 3 digits
  const lower = isolate(n, 0, 6)
  const mid = isolate(n, 6, 6)
  const upper = isolate(n, 12, 6)
  return encode(upper) + encode(mid) + encode(lower)
}

function encode4(n) {
  assert(0 <= n && n <= 0xffffff, ENCODE_OUTOFBOUNDS + n)
  // 24 bits -> 4 digits
  const lower = isolate(n, 0, 6)
  const aboveLower = isolate(n, 6, 6)
  const belowUpper = isolate(n, 12, 6)
  const upper = isolate(n, 18, 6)
  return encode(upper) + encode(belowUpper)
    + encode(aboveLower) + encode(lower)
}

function encode5(n) {
  assert(0 <= n && n <= 0x3fffffff, ENCODE_OUTOFBOUNDS + n)
  // 30 bits -> 5 digits
  const lower = isolate(n, 0, 6)
  const aboveLower = isolate(n, 6, 6)
  const mid = isolate(n, 12, 6)
  const belowUpper = isolate(n, 18, 6)
  const upper = isolate(n, 24, 6)
  return encode(upper) + encode(belowUpper)
    + encode(mid) + encode(aboveLower) + encode(lower)
}

function decodeFor(n) {
  return (
      n === 1 ? decode
    : n === 2 ? decode2
    : n === 3 ? decode3
    : n === 4 ? decode4
    : decode5
  )
}

function encodeFor(n) {
  return (
      n === 1 ? encode
    : n === 2 ? encode2
    : n === 3 ? encode3
    : n === 4 ? encode4
    : encode5
  )
}

module.exports = {
    encode
  , encode2
  , encode3
  , encode4
  , encode5
  , encodeFor
  , decode
  , decode2
  , decode3
  , decode4
  , decode5
  , decodeFor
  , SEPARATOR
}
