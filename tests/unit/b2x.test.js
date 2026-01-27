'use strict'

const test = require('brittle')
const B2XPowerMeter = require('../../workers/lib/models/b2x')
const {
  createReadTrackingClient,
  createPowermeter,
  createB2XTestData,
  createWriteTrackingClient,
  createMultiWriteTrackingClient
} = require('./helpers')

test('B2XPowerMeter _readValues - calls client.read with correct parameters', async (t) => {
  const { mockClient, readCalls } = createReadTrackingClient((functionCode, address, length) => {
    return Buffer.alloc(60) // 15 registers * 4 bytes per chunk
  })
  const powermeter = createPowermeter(B2XPowerMeter, { mockClient })

  await powermeter._readValues()

  t.is(readCalls.length, 2) // Should make 2 calls (chunks of 15 registers each)
  t.is(readCalls[0].functionCode, 3) // READ_HOLDING_REGISTERS
  t.is(readCalls[0].address, 23297)
  t.is(readCalls[0].length, 15)
  t.is(readCalls[1].functionCode, 3) // READ_HOLDING_REGISTERS
  t.is(readCalls[1].address, 23312) // 23297 + 15
  t.is(readCalls[1].length, 15)
})

test('B2XPowerMeter _prepSnap - with fresh data', async (t) => {
  const powermeter = createPowermeter(B2XPowerMeter)
  const testData = createB2XTestData()
  powermeter.readValues = async () => testData

  const result = await powermeter._prepSnap(false)

  t.ok(result.success)
  t.is(result.stats.power_w, 500.00)
  t.is(result.stats.powermeter_specific.v1_n_v, 230.0)
  t.is(result.stats.powermeter_specific.v2_n_v, 240.0)
  t.is(result.stats.powermeter_specific.v3_n_v, 250.0)
  t.is(result.stats.powermeter_specific.v1_v2_v, 410.0)
  t.is(result.stats.powermeter_specific.v2_v3_v, 420.0)
  t.is(result.stats.powermeter_specific.v1_v3_v, 430.0)
  t.is(result.stats.powermeter_specific.i1_a, 10.00)
  t.is(result.stats.powermeter_specific.i2_a, 11.00)
  t.is(result.stats.powermeter_specific.i3_a, 12.00)
  t.is(result.stats.powermeter_specific.in_a, 5.00)
  t.is(result.stats.powermeter_specific.active_power_total_w, 500.00)
  t.is(result.stats.powermeter_specific.reactive_power_total_var, 100.00)
  t.alike(result.config, {})
})

test('B2XPowerMeter _prepSnap - with cached data', async (t) => {
  const powermeter = createPowermeter(B2XPowerMeter)
  const testData = createB2XTestData()
  powermeter.cache = testData

  const result = await powermeter._prepSnap(true)

  t.ok(result.success)
  t.is(result.stats.power_w, 500.00)
  t.is(result.stats.powermeter_specific.v1_n_v, 230.0)
})

test('B2XPowerMeter resetPowerFailCounter', async (t) => {
  const { mockClient, tracking } = createWriteTrackingClient()
  const powermeter = createPowermeter(B2XPowerMeter, { mockClient })

  const result = await powermeter.resetPowerFailCounter()

  t.ok(tracking.writeCalled)
  t.is(tracking.writeParams.address, 'hr36608')
  t.alike(tracking.writeParams.data, Buffer.from([0x01]))
  t.ok(result.success)
})

test('B2XPowerMeter resetPowerOutageTime', async (t) => {
  const { mockClient, tracking } = createWriteTrackingClient()
  const powermeter = createPowermeter(B2XPowerMeter, { mockClient })

  const result = await powermeter.resetPowerOutageTime()

  t.ok(tracking.writeCalled)
  t.is(tracking.writeParams.address, 'hr36613')
  t.alike(tracking.writeParams.data, Buffer.from([0x01]))
  t.ok(result.success)
})

test('B2XPowerMeter resetSystemLog', async (t) => {
  const { mockClient, tracking } = createWriteTrackingClient()
  const powermeter = createPowermeter(B2XPowerMeter, { mockClient })

  const result = await powermeter.resetSystemLog()

  t.ok(tracking.writeCalled)
  t.is(tracking.writeParams.address, 'hr36657')
  t.alike(tracking.writeParams.data, Buffer.from([0x01]))
  t.ok(result.success)
})

test('B2XPowerMeter resetEventLog', async (t) => {
  const { mockClient, tracking } = createWriteTrackingClient()
  const powermeter = createPowermeter(B2XPowerMeter, { mockClient })

  const result = await powermeter.resetEventLog()

  t.ok(tracking.writeCalled)
  t.is(tracking.writeParams.address, 'hr36658')
  t.alike(tracking.writeParams.data, Buffer.from([0x01]))
  t.ok(result.success)
})

test('B2XPowerMeter resetNetQualityLog', async (t) => {
  const { mockClient, tracking } = createWriteTrackingClient()
  const powermeter = createPowermeter(B2XPowerMeter, { mockClient })

  const result = await powermeter.resetNetQualityLog()

  t.ok(tracking.writeCalled)
  t.is(tracking.writeParams.address, 'hr36659')
  t.alike(tracking.writeParams.data, Buffer.from([0x01]))
  t.ok(result.success)
})

test('B2XPowerMeter setAlarmConfig', async (t) => {
  const { mockClient, writeCalls } = createMultiWriteTrackingClient()
  const powermeter = createPowermeter(B2XPowerMeter, { mockClient })

  const alarmConfig = {
    index: 1,
    quantity: '1.2.3.4.5.6',
    limit_on: 1000n,
    limit_off: 500n,
    delay_on: 30,
    delay_off: 60,
    action: {
      types: ['writeLog'],
      output: 2
    }
  }

  const result = await powermeter.setAlarmConfig(alarmConfig)

  t.is(writeCalls.length, 5)
  t.is(writeCalls[0].address, 'hr35936')
  t.is(writeCalls[1].address, 'hr35937')
  t.is(writeCalls[2].address, 'hr35940')
  t.is(writeCalls[3].address, 'hr35948')
  t.is(writeCalls[4].address, 'hr35952')
  t.ok(result.success)
})
