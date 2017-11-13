'use strict'

function getDecodingTable(arr) {
  const map = new Map()
  for (var i = 0; i < arr.length; i++) {
    map.set(arr[i], i)
  }
  return map
}

// Based on: https://stackoverflow.com/a/40415059/97443 the following are safe
// A-Z a-z 0-9 - . _ ~ ( ) ' ! * : @ , ;
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
  'u', 'v', 'w', 'x', 'y', 'z', '-', '_' ]  // 56-63

const decodingTable = getDecodingTable(encodingTable)

function encode(x) {
  return encodingTable[x]
}

function decode(x) {
  return decodingTable.get(x)
}

module.exports = { encode, decode }
