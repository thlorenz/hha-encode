'use strict'

const fixedEncoder = require('./summary.fixed')
const variableEncoder = require('./summary.variable')

/*
Two parts. First the fixed length records, then the variable length records
separated by separator.
*/

function tryAddPlayersInvolved(actions, streetSummary) {
  if (actions == null) return
  if (streetSummary == null) return

  const positions = new Set()
  var folds = 0
  for (const a of actions) {
    positions.add(a.pos)
    if (a.type === 'folds') folds++
  }
  streetSummary.playersInvolved = positions.size + folds
}

function insertPlayersInvolved(summary) {
  tryAddPlayersInvolved(summary.flopActions, summary.flopSummary)
  tryAddPlayersInvolved(summary.turnActions, summary.turnSummary)
  tryAddPlayersInvolved(summary.riverActions, summary.riverSummary)
}

function encode(summary) {
  const fixed = fixedEncoder.encode(summary)
  const variable = variableEncoder.encode(summary)
  return fixed + variable
}

function decode(s) {
  var pos = 0
  const fixedChars = s.slice(pos, (pos += fixedEncoder.words))
  const variableChars = s.slice(pos)

  const summaryFixed = fixedEncoder.decode(fixedChars)
  const summaryVariable = variableEncoder.decode(variableChars)

  const summary = Object.assign(summaryFixed, summaryVariable)
  insertPlayersInvolved(summary)
  return summary
}

module.exports = { encode, decode }
