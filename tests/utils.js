'use strict'
const utils = require('miningos-tpl-wrk-powermeter/tests/utils')
const path = require('path')

utils.SCHEMA_PATHS.push(path.join(__dirname, 'schema'))
utils.TEST_PATHS.push(path.join(__dirname, 'cases'))

module.exports = utils
