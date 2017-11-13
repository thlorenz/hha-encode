module.exports =
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
        level: 'xi ',
        maxseats: 9 },
     seats:
      [ { pos: 'SB', chipsBB: 19.3, chipsAmount: 15451, hero: false },
        { pos: 'BB', chipsBB: 27.6, chipsAmount: 22060, hero: true, m: 16 },
        { pos: 'CO', chipsBB: 19.8, chipsAmount: 15875, hero: false },
        { pos: 'BU', chipsBB: 17.6, chipsAmount: 14114, hero: false } ],
     chipStackRatio: { label: 'M', amount: 16 },
     preflopSummary: { cards: { card1: '4c', card2: '2d' }, pos: 'BB' },
     preflopActions:
      [ { pos: 'CO', type: 'raise', amountBB: 2, amount: 1600 },
        { pos: 'BU', type: 'call', amountBB: 2, amount: 1600 },
        { type: 'folds', number: 2 } ],
     flopSummary:
      { pot: 4600,
        potBB: 5.8,
        board: [ '3c', 'Jc', '3h' ],
        playersInvolved: 2 },
     flopActions:
      [ { pos: 'CO', type: 'bet', amountBB: 3, amount: 2400 },
        { pos: 'BU', type: 'call', amountBB: 3, amount: 2400 } ],
     turnSummary: { pot: 9400, potBB: 11.8, board: '6h', playersInvolved: 2 },
     turnActions:
      [ { pos: 'CO', type: 'check' },
        { pos: 'BU', type: 'bet', amountBB: 2, amount: 1600 },
        { pos: 'CO', type: 'call', amountBB: 2, amount: 1600 } ],
     riverSummary: { pot: 12600, potBB: 15.8, board: '3d', playersInvolved: 2 },
     riverActions:
      [ { pos: 'CO', type: 'check' },
        { pos: 'BU', type: 'bet', amountBB: 4, amount: 3200 },
        { pos: 'CO', type: 'call', amountBB: 4, amount: 3200 } ],
     totalPot: { amount: 19000, bb: 23.8 },
     spoilers:
      [ { pos: 'CO', cards: { card1: 'Td', card2: 'Tc' } },
        { pos: 'BU', cards: { card1: 'Qs', card2: 'Jh' } } ] }
