'use strict'

var ocat = require('ocat')
ocat.opts = {
  prefix: '  spok(t, decoded, \n',
  suffix: ')',
  indent: '   ',
  depth: 5
}

module.exports = ocat
