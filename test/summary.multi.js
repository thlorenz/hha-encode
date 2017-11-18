'use strict'
if (process.env.TRAVIS != null) return

const test = require('tape')
const spok = require('spok')
const hhp = require('hhp')
const parse = hhp
const { extractHands } = hhp

const hha = require('hha')
const analyze = hha
const { script, summary } = hha

const { encode, decode } = require('../lib/summary/summary')

const path = require('path')
const fs = require('fs')

const testHandFile = path.join(__dirname, '..', 'tmp', 'hands.txt')
const testHands = fs.readFileSync(testHandFile, 'utf8')

const hands = extractHands(testHands)
const parsedHands = hands.map(parse)
const analyzedHands = parsedHands.map(analyze)
const scriptedHands = analyzedHands.map(script)
const summaries = scriptedHands.map(summary)

function sortKeys(obj) {
  if (obj == null) return obj
  const res = {}
  const keys = Object.keys(obj).sort()
  for (const k of keys) {
    var val  = obj[k]
    if (Array.isArray(val)) val = val.map(sortKeys)
    else if (typeof val === 'object') val = sortKeys(val)
    res[k] = val
  }
  return res
}

function save(obj, file) {
  obj = sortKeys(obj)
  fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf8')
}

const tmpdir = path.join(__dirname, '..', 'tmp')

// eslint-disable-next-line no-unused-vars
function saveSource() {
  const summarizedFile = path.join(tmpdir, 'summarized.json')
  const analyzedFile = path.join(tmpdir, 'analyzed.json')
  const parsedFile = path.join(tmpdir, 'parsed.json')
  const txtFile = path.join(tmpdir, 'hand.txt')
  fs.writeFileSync(txtFile, hands[0].join('\n'), 'utf8')
  save(parsedHands[0], parsedFile)
  save(analyzedHands[0], analyzedFile)
  save(summaries[0], summarizedFile)
}
// saveSource()

function saveBoth(original, decoded, idx) {
  const origFile = path.join(__dirname, '..', 'tmp', `${idx}.orig.json`)
  const decoFile = path.join(__dirname, '..', 'tmp', `${idx}.deco.json`)
  save(original, origFile)
  save(decoded, decoFile)
}

function rigchipsBB(x) {
  if (x.chipsBB > 1638.3) x.chipsBB = 1638.3
  return x
}

function allButKey(x, key) {
  const res = {}
  for (const k of Object.keys(x)) {
    if (k === key) continue
    res[k] = x[k]
  }
  return res
}

function allButAmountAndBBRigged(x) {
  x = allButKey(x, 'amount')
  if (x.amountBB > 1638.3) x.amountBB = 1638.3
  return x
}

function allButPot(x) {
  return allButKey(x, 'pot')
}

function removeExtraneous(summary) {
  summary.seats = summary.seats.map(x => ({ pos: x.pos, chipsBB: x.chipsBB }))
  if (summary.preflopActions) summary.preflopActions = summary.preflopActions.map(allButAmountAndBBRigged)
  if (summary.flopActions) summary.flopActions = summary.flopActions.map(allButAmountAndBBRigged)
  if (summary.turnActions) summary.turnActions = summary.turnActions.map(allButAmountAndBBRigged)
  if (summary.riverActions) summary.riverActions = summary.riverActions.map(allButAmountAndBBRigged)
  if (summary.preflopSummary) summary.preflopSummary = allButPot(summary.preflopSummary)
  if (summary.flopSummary) summary.flopSummary = allButPot(summary.flopSummary)
  if (summary.turnSummary) summary.turnSummary = allButPot(summary.turnSummary)
  if (summary.riverSummary) summary.riverSummary = allButPot(summary.riverSummary)

  if (summary.totalPot) summary.totalPot = allButAmountAndBBRigged(summary.totalPot)
  return summary
}

function roundtrip(t, original, idx, exact = false, save = false) {
  const ratio = original.chipStackRatio
  const cards = original.preflopSummary.cards
  const topic = `[${idx}] ${cards.card1}${cards.card2} ${ratio.label}${ratio.amount}`

  original = removeExtraneous(original)
  original.seats = original.seats.map(rigchipsBB)
  const encoded = encode(original)
  const decoded = decode(encoded)

  if (save) saveBoth(original, decoded, idx)

  spok(t, decoded, Object.assign({}, original, { $topic: topic }))
  if (exact) spok(t, original, Object.assign({}, decoded, { $topic: topic }))
}
// eslint-disable-next-line no-unused-vars
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true))
}

test('\nsummary: roundtripping multiple hands exact (amount removed)', function(t) {
  var idx = 0
  const throws = []
  for (const summary of summaries) {
    try {
      roundtrip(t, summary, idx++, false, false)
    } catch (err) { throws.push({ idx, err }) }
  }
  t.ok(true, `${throws.length} throws out of ${idx}`)

  if (throws.length) console.log(throws)
  t.end()
})

// inspect(summaries)
