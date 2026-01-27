'use strict'

const test = require('brittle')
const M1M20PowerMeter = require('../../workers/lib/models/m1m20')
const { createReadTrackingClient, createPowermeter, createM1M20TestData } = require('./helpers')

test('M1M20PowerMeter _readValues - calls client.read with correct parameters', async (t) => {
  const { mockClient, readCalls } = createReadTrackingClient()
  const powermeter = createPowermeter(M1M20PowerMeter, { mockClient })

  await powermeter._readValues()

  t.is(readCalls.length, 2)
  t.is(readCalls[0].functionCode, 3) // READ_HOLDING_REGISTERS
  t.is(readCalls[0].address, 23297)
  t.is(readCalls[0].length, 24)
  t.is(readCalls[1].functionCode, 3) // READ_HOLDING_REGISTERS
  t.is(readCalls[1].address, 51995)
  t.is(readCalls[1].length, 10)
})

test('M1M20PowerMeter _prepSnap - with fresh data', async (t) => {
  const powermeter = createPowermeter(M1M20PowerMeter)
  const testData = createM1M20TestData()
  powermeter.readValues = async () => testData

  const result = await powermeter._prepSnap(false)

  t.ok(result.success)
  t.is(result.stats.power_w, 50000)
  t.is(result.stats.powermeter_specific.v1_n_v, 230.0)
  t.is(result.stats.powermeter_specific.v2_n_v, 240.0)
  t.is(result.stats.powermeter_specific.v3_n_v, 250.0)
  t.is(result.stats.powermeter_specific.v1_v2_v, 410.0)
  t.is(result.stats.powermeter_specific.v2_v3_v, 420.0)
  t.is(result.stats.powermeter_specific.v3_v1_v, 430.0)
  t.is(result.stats.powermeter_specific.i1_a, 10.00)
  t.is(result.stats.powermeter_specific.i2_a, 11.00)
  t.is(result.stats.powermeter_specific.i3_a, 12.00)
  t.is(result.stats.powermeter_specific.in_a, 5.00)
  t.is(result.stats.powermeter_specific.active_power_total_w, 50000)
  t.is(result.stats.powermeter_specific.reactive_power_total_var, 10000)
  t.alike(result.config, {})
})

test('M1M20PowerMeter _prepSnap - with cached data', async (t) => {
  const powermeter = createPowermeter(M1M20PowerMeter)
  const testData = createM1M20TestData()
  powermeter.cache = testData

  const result = await powermeter._prepSnap(true)

  t.ok(result.success)
  t.is(result.stats.power_w, 50000)
  t.is(result.stats.powermeter_specific.v1_n_v, 230.0)
})

test('M1M20PowerMeter _prepSnap - with zero values', async (t) => {
  const powermeter = createPowermeter(M1M20PowerMeter)
  const testData = Buffer.alloc(68) // All zeros
  powermeter.readValues = async () => testData

  const result = await powermeter._prepSnap(false)

  t.ok(result.success)
  t.is(result.stats.power_w, 0)
  t.is(result.stats.powermeter_specific.v1_n_v, 0)
  t.is(result.stats.powermeter_specific.v2_n_v, 0)
  t.is(result.stats.powermeter_specific.v3_n_v, 0)
  t.is(result.stats.powermeter_specific.v1_v2_v, 0)
  t.is(result.stats.powermeter_specific.v2_v3_v, 0)
  t.is(result.stats.powermeter_specific.v3_v1_v, 0)
  t.is(result.stats.powermeter_specific.i1_a, 0)
  t.is(result.stats.powermeter_specific.i2_a, 0)
  t.is(result.stats.powermeter_specific.i3_a, 0)
  t.is(result.stats.powermeter_specific.in_a, 0)
  t.is(result.stats.powermeter_specific.active_power_total_w, 0)
  t.is(result.stats.powermeter_specific.reactive_power_total_var, 0)
})

test('M1M20PowerMeter _prepSnap - with negative power values', async (t) => {
  const powermeter = createPowermeter(M1M20PowerMeter)
  const testData = createM1M20TestData({ active_power_total_w: -25000, reactive_power_total_var: -5000 })
  powermeter.readValues = async () => testData

  const result = await powermeter._prepSnap(false)

  t.ok(result.success)
  t.is(result.stats.power_w, -25000)
  t.is(result.stats.powermeter_specific.active_power_total_w, -25000)
  t.is(result.stats.powermeter_specific.reactive_power_total_var, -5000)
})
