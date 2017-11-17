'use strict'

const seatsEncoder = require('./seats')
const actionsEncoder = require('./actions')
const spoilersEncoder = require('./spoilers')

const assert = require('assert')
const { SEPARATOR } = require('../url-safe-base64')

/*
| seats       | preflop actions  | flop actions  | turn actions  | river actions |  spoilers    |
| 3 (18) each |                                                                  |  3 (18) each |
*/

const MISSING_RECORD = 'unable to find record for '

function decode(s) {
  const seatsEnd = s.indexOf(SEPARATOR)
  assert(seatsEnd >= 0, MISSING_RECORD + 'seats')

  const seatsChars = s.slice(0, seatsEnd)
  s = s.slice(seatsEnd + 1)

  const preflopActionsEnd = s.indexOf(SEPARATOR)
  assert(preflopActionsEnd >= 0, MISSING_RECORD + 'preflop actions')
  const preflopActionsChars = s.slice(0, preflopActionsEnd)
  s = s.slice(preflopActionsEnd + 1)

  const flopActionsEnd = s.indexOf(SEPARATOR)
  assert(flopActionsEnd >= 0, MISSING_RECORD + 'flop actions')
  const flopActionsChars = s.slice(0, flopActionsEnd)
  s = s.slice(flopActionsEnd + 1)

  const turnActionsEnd = s.indexOf(SEPARATOR)
  assert(turnActionsEnd >= 0, MISSING_RECORD + 'turn actions')
  const turnActionsChars = s.slice(0, turnActionsEnd)
  s = s.slice(turnActionsEnd + 1)

  const riverActionsEnd = s.indexOf(SEPARATOR)
  assert(riverActionsEnd >= 0, MISSING_RECORD + 'river actions')
  const riverActionsChars = s.slice(0, riverActionsEnd)
  s = s.slice(riverActionsEnd + 1)

  const spoilersEnd = s.indexOf(SEPARATOR)
  assert(spoilersEnd >= 0, MISSING_RECORD + 'spoilers')
  const spoilersChars = s.slice(0, spoilersEnd)

  const seats = seatsEncoder.decode(seatsChars)
  const preflopActions = actionsEncoder.decode(preflopActionsChars)
  const flopActions = actionsEncoder.decode(flopActionsChars)
  const turnActions = actionsEncoder.decode(turnActionsChars)
  const riverActions = actionsEncoder.decode(riverActionsChars)
  const spoilers = spoilersEncoder.decode(spoilersChars)

  return { seats, preflopActions, flopActions, turnActions, riverActions, spoilers }
}

function encode(summary) {
  const encodedSeats = seatsEncoder.encode(summary.seats) + SEPARATOR
  const encodedPreflopActions = actionsEncoder.encode(summary.preflopActions) + SEPARATOR
  const encodedFlopActions = actionsEncoder.encode(summary.flopActions) + SEPARATOR
  const encodedTurnActions = actionsEncoder.encode(summary.turnActions) + SEPARATOR
  const encodedRiverActions = actionsEncoder.encode(summary.riverActions) + SEPARATOR
  const encodedSpoilers = spoilersEncoder.encode(summary.spoilers) + SEPARATOR

  return (
    encodedSeats +
    encodedPreflopActions + encodedFlopActions + encodedTurnActions + encodedRiverActions +
    encodedSpoilers
  )
}

module.exports = { encode, decode }
