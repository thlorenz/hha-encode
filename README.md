# hha-encode


Encodes and decodes processed Pokerhands.

```js
const { encode, decode } = require('hha-encode').summary

const original =
  { header:
    { room: 'pokerstars',
      gametype: 'tournament',
      currency: '$',
      donation: 0.91,
      rake: 0.09,
      pokertype: 'holdem',
      limit: 'nolimit',
      sb: 400,
      bb: 800,
      ante: 50,
      level: 'xi',
      maxseats: 9 },
    seats:
    [ { pos: 'SB', chipsBB: 19.3 },
      { pos: 'BB', chipsBB: 27.6 },
      { pos: 'CO', chipsBB: 19.8 },
      { pos: 'BU', chipsBB: 17.6 } ],
    chipStackRatio: { label: 'M', amount: 16 },
    preflopSummary: { cards: { card1: '4c', card2: '2d' }, pos: 'BB' },
    preflopActions:
    [ { pos: 'CO', type: 'raise', amountBB: 2 },
      { pos: 'BU', type: 'call', amountBB: 2 },
      { type: 'folds', number: 2 } ],
    flopSummary:
    { potBB: 5.8,
      board: [ '3c', 'Jc', '3h' ],
      playersInvolved: 2 },
    flopActions:
    [ { pos: 'CO', type: 'bet', amountBB: 3 },
      { pos: 'BU', type: 'call', amountBB: 3 } ],
    turnSummary: { potBB: 11.8, board: '6h', playersInvolved: 2 },
    turnActions:
    [ { pos: 'CO', type: 'check' },
      { pos: 'BU', type: 'bet', amountBB: 2 },
      { pos: 'CO', type: 'call', amountBB: 2 } ],
    riverSummary: { potBB: 15.8, board: '3d', playersInvolved: 2 },
    riverActions:
    [ { pos: 'CO', type: 'check' },
      { pos: 'BU', type: 'bet', amountBB: 4 },
      { pos: 'CO', type: 'call', amountBB: 4 } ],
    totalPot: { bb: 23.8 },
    spoilers:
    [ { pos: 'CO', cards: { card1: 'Td', card2: 'Tc' } },
      { pos: 'BU', cards: { card1: 'Qs', card2: 'Jh' } } ] }

const encoded = encode(original)
const decoded = decode(encoded)

console.log(encoded)
console.log(decoded)
```

```
000aB2G0Mm241401JBAa2WkWiDj0000w0001s0002U0003k08Y43184Ka36e2m*0a0K1e0K502*2a0U1e0U*392e0K1a0K*392e0e1a0e*9HIACB*
{ header:
   { room: 'pokerstars',
     gametype: 'tournament',
     currency: '$',
     pokertype: 'holdem',
     limit: 'nolimit',
     maxseats: 9,
     level: 'xi',
     donation: 0.91,
     rake: 0.09,
     sb: 400,
     bb: 800,
     ante: 50 },
  totalPot: { bb: 23.8 },
  chipStackRatio: { label: 'M', amount: 16 },
  preflopSummary: { pos: 'BB', cards: { card1: '4c', card2: '2d' } },
  flopSummary: { board: [ '3c', 'Jc', '3h' ], potBB: 5.8, playersInvolved: 2 },
  turnSummary: { board: '6h', potBB: 11.8, playersInvolved: 2 },
  riverSummary: { board: '3d', potBB: 15.8, playersInvolved: 2 },
  seats:
   [ { pos: 'SB', chipsBB: 19.3 },
     { pos: 'BB', chipsBB: 27.6 },
     { pos: 'CO', chipsBB: 19.8 },
     { pos: 'BU', chipsBB: 17.6 } ],
  spoilers:
   [ { pos: 'CO', cards: [Object] },
     { pos: 'BU', cards: [Object] } ],
  preflopActions:
   [ { type: 'raise', amountBB: 2, pos: 'CO' },
     { type: 'call', amountBB: 2, pos: 'BU' },
     { type: 'folds', number: 2 } ],
  flopActions:
   [ { type: 'bet', amountBB: 3, pos: 'CO' },
     { type: 'call', amountBB: 3, pos: 'BU' } ],
  turnActions:
   [ { type: 'check', pos: 'CO' },
     { type: 'bet', amountBB: 2, pos: 'BU' },
     { type: 'call', amountBB: 2, pos: 'CO' } ],
  riverActions:
   [ { type: 'check', pos: 'CO' },
     { type: 'bet', amountBB: 4, pos: 'BU' },
     { type: 'call', amountBB: 4, pos: 'CO' } ] }

```

## Installation

    npm install hhaencode

## [API](https://thlorenz.github.io/hha-encode)


## License

MIT
