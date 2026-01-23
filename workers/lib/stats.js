'use strict'

const libStats = require('miningos-tpl-wrk-thing/workers/lib/stats')
const { groupBy } = require('miningos-lib-stats/utils')

libStats.specs.powermeter = {
  ops: {
    site_power_w: {
      op: 'sum',
      src: 'last.snap.stats.power_w',
      filter: (entry, ext) => ext?.info?.pos === 'site'
    },
    power_w_container_group_sum: {
      op: 'group_sum',
      src: 'last.snap.stats.power_w',
      group: groupBy('info.container')
    }
  }
}

module.exports = libStats
