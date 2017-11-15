'use strict'

const positions = [ 'N/A', 'SB', 'BB', 'UTG', 'UTG+1', 'UTG+2', 'MP', 'LJ', 'HJ', 'CO', 'BU' ]
const positionsSet = positions.reduce((set, k) => set.add(k), new Set())

module.exports = {
    positions
  , positionsSet
}
