'use strict'

const assert = require('assert')

const headerEncoder = require('./header')
const heroEncoder = require('./hero')
const boardEncoder = require('./board')
const potsEncoder = require('./pots')
const playersInvolvedEncoder = require('./players-involved')

const { CARD_NOT_PRESENT } = require('../encoder.card')

/*
|           header           |
| header.info | header.chips |  hero    |  board  |  pots    | players involved | __total__
|   5 (30)    |   11 (66)    |   5 (30) |  5 (30) | 10 (60)  |      3 (12)      |  39 (228)
*/

const totalWords = (
  headerEncoder.words + heroEncoder.words + boardEncoder.words +
  potsEncoder.words + playersInvolvedEncoder.words
)

function notpresent(card) {
  return card == null || card === CARD_NOT_PRESENT
}

function istourney(type) {
  return /tournament/.test(type)
}

function extractHero(summary) {
  const { cards, pos } = summary.preflopSummary
  const stackRatio = summary.chipStackRatio.amount
  return { pos, cards, stackRatio }
}

function insertHero(summary, { pos, cards, label, stackRatio }) {
  summary.chipStackRatio = { label, amount: stackRatio }
  summary.preflopSummary = { pos, cards }
}

function extractBoard(summary) {
  const flop = summary.flopSummary
  if (flop == null || flop.board == null || flop.board.length < 3) return {}
  const b = { card1: flop.board[0], card2: flop.board[1], card3: flop.board[2] }

  const turn = summary.turnSummary
  const river = summary.riverSummary
  b.card4 = turn && turn.board
  b.card5 = river && river.board
  return b
}

function insertBoard(summary, { card1, card2, card3, card4, card5 } = {}) {
  if (notpresent(card1)) return
  (summary.flopSummary = summary.flopSummary || {}).board = [ card1, card2, card3 ]
  if (notpresent(card4)) return
  (summary.turnSummary = summary.turnSummary || {}).board = card4
  if (notpresent(card5)) return
  (summary.riverSummary = summary.riverSummary || {}).board = card5
}

function extractPots(summary) {
  const flop = summary.flopSummary && summary.flopSummary.potBB
  const turn = summary.turnSummary && summary.turnSummary.potBB
  const river = summary.riverSummary && summary.riverSummary.potBB
  const total = summary.totalPot && summary.totalPot.bb

  return { flop, turn, river, total }
}

function insertPots(summary, { flop, turn, river, total }  = {}) {
  summary.totalPot.bb = total

  if (flop === 0) return
  (summary.flopSummary = summary.flopSummary || {}).potBB = flop
  if (turn === 0) return
  (summary.turnSummary = summary.turnSummary || {}).potBB = turn
  if (river === 0) return
  (summary.riverSummary = summary.riverSummary || {}).potBB = river
}

function extractPlayersInvolved(summary) {
  const flop = (summary.flopSummary && summary.flopSummary.playersInvolved) || 0
  const turn = (summary.turnSummary && summary.turnSummary.playersInvolved) || 0
  const river = (summary.riverSummary && summary.riverSummary.playersInvolved) || 0
  return { flop, turn, river }
}

function insertPlayersInvolved(summary, { flop, turn, river } = {}) {
  if (flop === 0) return
  (summary.flopSummary = summary.flopSummary || {}).playersInvolved = flop
  if (turn === 0) return
  (summary.turnSummary = summary.turnSummary || {}).playersInvolved = turn
  if (river === 0) return
  (summary.riverSummary = summary.riverSummary || {}).playersInvolved = river
}

function encode(summary) {
  const encodedHeader = headerEncoder.encode(summary.header)
  const encodedHero = heroEncoder.encode(extractHero(summary))
  const encodedBoard = boardEncoder.encode(extractBoard(summary))
  const encodedPots = potsEncoder.encode(extractPots(summary))
  const encodedPlayersInvolved = playersInvolvedEncoder.encode(extractPlayersInvolved(summary))

  const res = encodedHeader + encodedHero + encodedBoard + encodedPots + encodedPlayersInvolved
  assert.equal(res.length, totalWords)
  return res
}

function decode(s) {
  assert.equal(s.length, totalWords, `Fixed summary needs ${totalWords} words, but given ${s.length}`)
  var pos = 0
  const headerChars = s.slice(pos, (pos += headerEncoder.words))
  const heroChars = s.slice(pos, (pos += heroEncoder.words))
  const boardChars = s.slice(pos, (pos += boardEncoder.words))
  const potsChars = s.slice(pos, (pos += potsEncoder.words))
  const playersInvolvedChars = s.slice(pos, (pos += playersInvolvedEncoder.words))

  const header = headerEncoder.decode(headerChars)
  const hr = heroEncoder.decode(heroChars)
  const hero = Object.assign(hr, { label: istourney(header.gametype) ? 'M' : 'BB' })
  const board = boardEncoder.decode(boardChars)
  const pots = potsEncoder.decode(potsChars)
  const playersInvolved = playersInvolvedEncoder.decode(playersInvolvedChars)

  const summary = {
      header
    , totalPot: {}
  }

  insertHero(summary, hero)
  insertBoard(summary, board)
  insertPots(summary, pots)
  insertPlayersInvolved(summary, playersInvolved)

  return summary
}

module.exports = { encode, decode, words: totalWords }
