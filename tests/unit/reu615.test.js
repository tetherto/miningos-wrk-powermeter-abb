'use strict'

const test = require('brittle')
const REU615PowerMeter = require('../../workers/lib/models/reu615')
const { createReadTrackingClient, createPowermeter, createREU615TestData } = require('./helpers')

test('REU615PowerMeter _readValues - calls client.read with correct parameters', async (t) => {
  const { mockClient, readCalls } = createReadTrackingClient((functionCode, address, length) => {
    return Buffer.alloc(4) // 2 registers * 2 bytes each
  })
  const powermeter = createPowermeter(REU615PowerMeter, { mockClient })

  await powermeter._readValues()

  t.is(readCalls.length, 2)
  t.is(readCalls[0].functionCode, 3) // READ_HOLDING_REGISTERS
  t.is(readCalls[0].address, 1940)
  t.is(readCalls[0].length, 2)
  t.is(readCalls[1].functionCode, 3) // READ_HOLDING_REGISTERS
  t.is(readCalls[1].address, 1942)
  t.is(readCalls[1].length, 2)
})

test('REU615PowerMeter _prepSnap - with fresh data', async (t) => {
  const powermeter = createPowermeter(REU615PowerMeter)
  const testData = createREU615TestData(50000, 34500)
  powermeter.readValues = async () => testData

  const result = await powermeter._prepSnap(false)

  t.ok(result.success)
  t.is(result.stats.power_w, 50000)
  t.is(result.stats.voltage_v, 34500)
  t.alike(result.config, {})
})

test('REU615PowerMeter _prepSnap - with cached data', async (t) => {
  const powermeter = createPowermeter(REU615PowerMeter)
  const testData = createREU615TestData(25000, 33000)
  powermeter.cache = testData

  const result = await powermeter._prepSnap(true)

  t.ok(result.success)
  t.is(result.stats.power_w, 25000)
  t.is(result.stats.voltage_v, 33000)
})

test('REU615PowerMeter _prepSnap - with zero power', async (t) => {
  const powermeter = createPowermeter(REU615PowerMeter)
  const testData = createREU615TestData(0, 34500)
  powermeter.readValues = async () => testData

  const result = await powermeter._prepSnap(false)

  t.ok(result.success)
  t.is(result.stats.power_w, 0)
  t.is(result.stats.voltage_v, 34500)
})

test('REU615PowerMeter _prepSnap - with negative power', async (t) => {
  const powermeter = createPowermeter(REU615PowerMeter)
  const testData = createREU615TestData(-15000, 34500)
  powermeter.readValues = async () => testData

  const result = await powermeter._prepSnap(false)

  t.ok(result.success)
  t.is(result.stats.power_w, -15000)
  t.is(result.stats.voltage_v, 34500)
})

test('REU615PowerMeter _prepSnap - with maximum positive power', async (t) => {
  const powermeter = createPowermeter(REU615PowerMeter)
  const testData = createREU615TestData(2147483647, 34500)
  powermeter.readValues = async () => testData

  const result = await powermeter._prepSnap(false)

  t.ok(result.success)
  t.is(result.stats.power_w, 2147483647)
  t.is(result.stats.voltage_v, 34500)
})

test('REU615PowerMeter _prepSnap - with minimum negative power', async (t) => {
  const powermeter = createPowermeter(REU615PowerMeter)
  const testData = createREU615TestData(-2147483648, 34500)
  powermeter.readValues = async () => testData

  const result = await powermeter._prepSnap(false)

  t.ok(result.success)
  t.is(result.stats.power_w, -2147483648)
  t.is(result.stats.voltage_v, 34500)
})

test('REU615PowerMeter _prepSnap - power value range test', async (t) => {
  const powermeter = createPowermeter(REU615PowerMeter)

  // Test various power values
  const testCases = [
    0,
    1000,
    -1000,
    50000,
    -50000,
    1000000,
    -1000000,
    2147483647,
    -2147483648
  ]

  for (const powerValue of testCases) {
    const testData = createREU615TestData(powerValue, 34500)
    powermeter.readValues = async () => testData

    const result = await powermeter._prepSnap(false)

    t.ok(result.success)
    t.is(result.stats.power_w, powerValue, `Power value ${powerValue} should be preserved`)
    t.is(result.stats.voltage_v, 34500, 'Voltage value should be preserved')
  }
})

test('REU615PowerMeter _prepSnap - voltage value range test', async (t) => {
  const powermeter = createPowermeter(REU615PowerMeter)

  // Test various voltage values (medium voltage typically 1kV-35kV)
  const testCases = [
    0,
    1000,
    10000,
    34500,
    35000,
    100000
  ]

  for (const voltageValue of testCases) {
    const testData = createREU615TestData(50000, voltageValue)
    powermeter.readValues = async () => testData

    const result = await powermeter._prepSnap(false)

    t.ok(result.success)
    t.is(result.stats.voltage_v, voltageValue, `Voltage value ${voltageValue} should be preserved`)
  }
})
