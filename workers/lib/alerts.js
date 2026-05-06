'use strict'

const libAlerts = require('@tetherto/miningos-tpl-wrk-powermeter/workers/lib/alerts')
const libUtils = require('@tetherto/miningos-tpl-wrk-powermeter/workers/lib/utils')

libAlerts.specs.powermeter = {
  ...libAlerts.specs.powermeter_default,
  medium_voltage_low: {
    valid: (ctx, snap) => {
      return libUtils.isValidSnap(snap) && !libUtils.isOffline(snap) && ctx.conf.medium_voltage_low
    },
    probe: (ctx, snap) => {
      const voltage = snap.stats.voltage_v
      if (voltage === undefined || voltage === null) return false
      return voltage < ctx.conf.medium_voltage_low.minVoltage
    }
  },
  medium_voltage_high: {
    valid: (ctx, snap) => {
      return libUtils.isValidSnap(snap) && !libUtils.isOffline(snap) && ctx.conf.medium_voltage_high
    },
    probe: (ctx, snap) => {
      const voltage = snap.stats.voltage_v
      if (voltage === undefined || voltage === null) return false
      return voltage > ctx.conf.medium_voltage_high.maxVoltage
    }
  }
}

module.exports = libAlerts
