'use strict'

function dectoen(arr) {
  const map = new Map()
  for (var i = 0; i < arr.length; i++) {
    map.set(arr[i], i)
  }
  return map
}

// room
// 32 rooms -> 5 bits
const roomDec = [
    'pokerstars' // 0
  , 'ignition'   // 1
]
const roomEnc = dectoen(roomDec)

// gametype
// 8 gametypes -> 3 bits
const gametypeDec = [
    'tournament'  // 0
  , 'cash'        // 1
]
const gametypeEnc = dectoen(gametypeDec)

// currency
// 16 currencies -> 4 bits
const currencyDec = [
    '$' // 0
  , '€' // 1
]
const currencyEnc = dectoen(currencyDec)

// pokertype
// 16 types -> 4 bits
const pokertypeDec = [
    'holdem'  // 0
]
const pokertypeEnc = dectoen(pokertypeDec)

// limit
// 4 types -> 2 bits
const limitDec = [
    'nolimit'     // 0
  , 'potlimit'    // 1
  , 'fixedlimit'  // 2
]
const limitEnc = dectoen(limitDec)

// level
// 256 levels -> 8 bits
// no further encoding/decoding, just take the number and convert to/from roman notation

// maxseats
// 16 (actually 10 max) -> 4 bits
// no further encoding/decoding, just take the number as is

/*
| room  | gametype | currency | pokertype | limit | _total_
| 00000 | 000      | 0000     | 0000      | 00    |
|   5   |  3       |  4       | 4         | 2     |   18
*/

// binary bits starting from least significant bit
/* eslint-disable comma-spacing */
const headerBits = [
    [ 'limit'     , 2 ]
  , [ 'pokertype' , 4 ]
  , [ 'currency'  , 4 ]
  , [ 'gametype'  , 3 ]
  , [ 'room'      , 5 ]
]
const headerLayout = bitsToLayout(headerBits)
console.log(headerLayout)

function shiftMask(n, digits, mask) {
  const shifted = n >> digits
  return shifted & mask
}

function maskForBits(n) {
  return (0b1 << n) - 1
}

function bitsToLayout(bits) {
  var idx = 0
  const map = new Map()
  for (const [ name, b ] of bits) {
    const mask = maskForBits(b)
    map.set(name, [ idx, mask ])
    idx += b
  }
  return map
}

function decodeRoom(n) {
  const [ idx, mask ] = headerLayout.get('room')
  const room = shiftMask(n, idx, mask)
  return roomDec[room]
}

function encodeRoom(room, n) {
  const [ idx ] = headerLayout.get('room')
  const b = roomEnc.get(room)
  return (b << idx) | n
}

function decodeGametype(n) {
  const [ idx, mask ] = headerLayout.get('gametype')
  const gt = shiftMask(n, idx, mask)
  return gametypeDec[gt]
}

function decodeCurrency(n) {
  const [ idx, mask ] = headerLayout.get('currency')
  const curr = shiftMask(n, idx, mask)
  return currencyDec[curr]
}

const example = 0b000010010001000110
const decodedRoom = decodeRoom(example)
const decodedGametype = decodeGametype(example)
const decodedCurrency = decodeCurrency(example)

console.log({ decodedRoom, decodedGametype, decodedCurrency })
console.log(encodeRoom('ignition', 0).toString(2))
