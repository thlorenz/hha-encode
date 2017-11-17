'use strict'

const headerEncoder = require('./header')
const heroEncoder = require('./hero')
const boardEncoder = require('./board')
const potsEncoder = require('./pots')

/*
|           header           |
| header.info | header.chips |  hero    |  board  |  pots    | __total__
|   5 (30)    |   10 (60)    |   5 (30) |  5 (30) | 10 (60)  |  35 (210)
*/

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
  summary.flopSummary.board = [ card1, card2, card3 ]
  summary.turnSummary.board = card4
  summary.riverSummary.board = card5
}

function extractPots(summary) {
  const flop = summary.flopSummary && summary.flopSummary.potBB
  const turn = summary.turnSummary && summary.turnSummary.potBB
  const river = summary.riverSummary && summary.riverSummary.potBB
  const total = summary.totalPot && summary.totalPot.bb

  return { flop, turn, river, total }
}

function insertPots(summary, { flop, turn, river, total }  = {}) {
  summary.flopSummary.potBB = flop
  summary.turnSummary.potBB = turn
  summary.riverSummary.potBB = river
  summary.totalPot.bb = total
}

function encode(summary) {
  const encodedHeader = headerEncoder.encode(summary.header)
  const encodedHero = heroEncoder.encode(extractHero(summary))
  const encodedBoard = boardEncoder.encode(extractBoard(summary))
  const encodedPots = potsEncoder.encode(extractPots(summary))

  return encodedHeader + encodedHero + encodedBoard + encodedPots
}

function decode(s) {
  var pos = 0
  const headerChars = s.slice(pos, (pos += headerEncoder.words))
  const heroChars = s.slice(pos, (pos += heroEncoder.words))
  const boardChars = s.slice(pos, (pos += boardEncoder.words))
  const potsChars = s.slice(pos, (pos += potsEncoder.words))

  const header = headerEncoder.decode(headerChars)
  const hr = heroEncoder.decode(heroChars)
  const hero = Object.assign(hr, { label: istourney(header.gametype) ? 'M' : 'BB' })
  const board = boardEncoder.decode(boardChars)
  const pots = potsEncoder.decode(potsChars)

  const summary = {
      header
    , preflopSummary: {}
    , flopSummary: {}
    , turnSummary: {}
    , riverSummary: {}
    , totalPot: {}
  }

  insertHero(summary, hero)
  insertBoard(summary, board)
  insertPots(summary, pots)

  return summary
}

module.exports = { encode, decode, words: 35 }
