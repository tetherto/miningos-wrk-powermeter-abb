'use strict'

const test = require('brittle')
const alerts = require('../../workers/lib/alerts')

test('alerts - module exports libAlerts', (t) => {
  t.ok(alerts, 'should export alerts module')
  t.ok(alerts.specs, 'should have specs property')
  t.ok(alerts.specs.powermeter, 'should have powermeter specs')
})

test('alerts - powermeter specs structure', (t) => {
  const { specs } = alerts
  const powermeterSpecs = specs.powermeter

  t.ok(powermeterSpecs, 'should have powermeter specs')
  t.ok(typeof powermeterSpecs === 'object', 'should be an object')

  t.ok(powermeterSpecs.medium_voltage_low, 'should have medium_voltage_low alert')
  t.ok(powermeterSpecs.medium_voltage_high, 'should have medium_voltage_high alert')
})

test('alerts - medium_voltage_low alert structure', (t) => {
  const mediumVoltageLow = alerts.specs.powermeter.medium_voltage_low

  t.ok(mediumVoltageLow, 'should exist')
  t.ok(typeof mediumVoltageLow.valid === 'function', 'should have valid function')
  t.ok(typeof mediumVoltageLow.probe === 'function', 'should have probe function')
})

test('alerts - medium_voltage_high alert structure', (t) => {
  const mediumVoltageHigh = alerts.specs.powermeter.medium_voltage_high

  t.ok(mediumVoltageHigh, 'should exist')
  t.ok(typeof mediumVoltageHigh.valid === 'function', 'should have valid function')
  t.ok(typeof mediumVoltageHigh.probe === 'function', 'should have probe function')
})

test('alerts - medium_voltage_low probe function', (t) => {
  const mediumVoltageLow = alerts.specs.powermeter.medium_voltage_low

  const ctx = {
    conf: {
      medium_voltage_low: {
        minVoltage: 32000
      }
    }
  }

  const lowVoltageSnap = {
    stats: {
      voltage_v: 31000 // Below minVoltage threshold
    }
  }
  t.ok(mediumVoltageLow.probe(ctx, lowVoltageSnap), 'should trigger for voltage below threshold')

  const normalVoltageSnap = {
    stats: {
      voltage_v: 34500 // Above minVoltage threshold
    }
  }
  t.not(mediumVoltageLow.probe(ctx, normalVoltageSnap), 'should not trigger for voltage above threshold')

  const exactThresholdSnap = {
    stats: {
      voltage_v: 32000 // At minVoltage threshold
    }
  }
  t.not(mediumVoltageLow.probe(ctx, exactThresholdSnap), 'should not trigger for voltage at threshold')

  const noVoltageSnap = {
    stats: {}
  }
  t.not(mediumVoltageLow.probe(ctx, noVoltageSnap), 'should not trigger when no voltage data')

  const nullVoltageSnap = {
    stats: {
      voltage_v: null
    }
  }
  t.not(mediumVoltageLow.probe(ctx, nullVoltageSnap), 'should not trigger when voltage is null')

  const zeroVoltageSnap = {
    stats: {
      voltage_v: 0
    }
  }
  t.ok(mediumVoltageLow.probe(ctx, zeroVoltageSnap), 'should trigger for zero voltage')
})

test('alerts - medium_voltage_high probe function', (t) => {
  const mediumVoltageHigh = alerts.specs.powermeter.medium_voltage_high

  const ctx = {
    conf: {
      medium_voltage_high: {
        maxVoltage: 36000
      }
    }
  }

  const highVoltageSnap = {
    stats: {
      voltage_v: 37000 // Above maxVoltage threshold
    }
  }
  t.ok(mediumVoltageHigh.probe(ctx, highVoltageSnap), 'should trigger for voltage above threshold')

  const normalVoltageSnap = {
    stats: {
      voltage_v: 34500 // Below maxVoltage threshold
    }
  }
  t.not(mediumVoltageHigh.probe(ctx, normalVoltageSnap), 'should not trigger for voltage below threshold')

  const exactThresholdSnap = {
    stats: {
      voltage_v: 36000 // At maxVoltage threshold
    }
  }
  t.not(mediumVoltageHigh.probe(ctx, exactThresholdSnap), 'should not trigger for voltage at threshold')

  const noVoltageSnap = {
    stats: {}
  }
  t.not(mediumVoltageHigh.probe(ctx, noVoltageSnap), 'should not trigger when no voltage data')

  const nullVoltageSnap = {
    stats: {
      voltage_v: null
    }
  }
  t.not(mediumVoltageHigh.probe(ctx, nullVoltageSnap), 'should not trigger when voltage is null')
})

test('alerts - voltage boundary conditions', (t) => {
  const mediumVoltageLow = alerts.specs.powermeter.medium_voltage_low
  const mediumVoltageHigh = alerts.specs.powermeter.medium_voltage_high

  const ctx = {
    conf: {
      medium_voltage_low: { minVoltage: 32000 },
      medium_voltage_high: { maxVoltage: 36000 }
    }
  }

  const justBelowLow = { stats: { voltage_v: 31999 } }
  t.ok(mediumVoltageLow.probe(ctx, justBelowLow), 'should trigger low alert for 31999V')

  const justAboveLow = { stats: { voltage_v: 32001 } }
  t.not(mediumVoltageLow.probe(ctx, justAboveLow), 'should not trigger low alert for 32001V')

  const justBelowHigh = { stats: { voltage_v: 35999 } }
  t.not(mediumVoltageHigh.probe(ctx, justBelowHigh), 'should not trigger high alert for 35999V')

  const justAboveHigh = { stats: { voltage_v: 36001 } }
  t.ok(mediumVoltageHigh.probe(ctx, justAboveHigh), 'should trigger high alert for 36001V')
})
