'use strict'

const {
    dectoen
  , number
  , bitsToLayout
  , isolate
  , maskForBits
  , shiftMask
  , bin
} = require('kodieren')

function istourney(type) {
  return /tournament/.test(type)
}

module.exports = {
    dectoen
  , number
  , bitsToLayout
  , isolate
  , maskForBits
  , shiftMask
  , bin
  , istourney
}
