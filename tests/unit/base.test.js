'use strict'

const test = require('brittle')
const ABBPowerMeter = require('../../workers/lib/models/base')

test('ABBPowerMeter constructor - with valid getClient', (t) => {
  const mockClient = { end: () => {} }
  const getClient = () => mockClient
  const opts = { address: '127.0.0.1', port: 502, unitId: 1, timeout: 5000 }

  const powermeter = new ABBPowerMeter({ getClient, ...opts })

  t.ok(powermeter)
  t.is(powermeter.client, mockClient)
  t.is(powermeter.opts.address, opts.address)
  t.is(powermeter.opts.port, opts.port)
  t.is(powermeter.opts.unitId, opts.unitId)
  t.is(powermeter.opts.timeout, opts.timeout)
})

test('ABBPowerMeter close method', (t) => {
  let clientEndCalled = false
  const mockClient = {
    end: () => { clientEndCalled = true }
  }
  const getClient = () => mockClient
  const opts = { address: '127.0.0.1', port: 502, unitId: 1, timeout: 5000 }

  const powermeter = new ABBPowerMeter({ getClient, ...opts })
  powermeter.close()

  t.ok(clientEndCalled)
})

test('ABBPowerMeter readValues - success case', async (t) => {
  const mockData = Buffer.from('test data')
  const mockClient = { end: () => {} }
  const getClient = () => mockClient
  const opts = { address: '127.0.0.1', port: 502, unitId: 1, timeout: 5000 }

  const powermeter = new ABBPowerMeter({ getClient, ...opts })

  // Mock _readValues to return test data
  powermeter._readValues = async () => mockData

  const result = await powermeter.readValues()

  t.alike(result, mockData)
  t.alike(powermeter.cache, mockData)
  t.is(powermeter.cacheTime, 0)
})

test('ABBPowerMeter readValues - error case with no cache', async (t) => {
  const mockClient = { end: () => {} }
  const getClient = () => mockClient
  const opts = { address: '127.0.0.1', port: 502, unitId: 1, timeout: 5000 }

  const powermeter = new ABBPowerMeter({ getClient, ...opts })
  powermeter.conf = { cacheLimit: 3 }
  powermeter.cacheTime = 3 // Set to cache limit so it will throw

  // Mock _readValues to throw error
  powermeter._readValues = async () => {
    throw new Error('Read error')
  }

  await t.exception(async () => {
    await powermeter.readValues()
  }, /Read error/)
})

test('ABBPowerMeter readValues - error case with cache available', async (t) => {
  const mockClient = { end: () => {} }
  const getClient = () => mockClient
  const opts = { address: '127.0.0.1', port: 502, unitId: 1, timeout: 5000 }

  const powermeter = new ABBPowerMeter({ getClient, ...opts })
  powermeter.conf = { cacheLimit: 3 }
  powermeter.cache = Buffer.from('cached data')
  powermeter.cacheTime = 1

  // Mock _readValues to throw error
  powermeter._readValues = async () => {
    throw new Error('Read error')
  }

  const result = await powermeter.readValues()

  t.alike(result, Buffer.from('cached data'))
  t.is(powermeter.cacheTime, 2)
})

test('ABBPowerMeter readValues - error case with cache limit exceeded', async (t) => {
  const mockClient = { end: () => {} }
  const getClient = () => mockClient
  const opts = { address: '127.0.0.1', port: 502, unitId: 1, timeout: 5000 }

  const powermeter = new ABBPowerMeter({ getClient, ...opts })
  powermeter.conf = { cacheLimit: 3 }
  powermeter.cache = Buffer.from('cached data')
  powermeter.cacheTime = 3 // At cache limit

  // Mock _readValues to throw error
  powermeter._readValues = async () => {
    throw new Error('Read error')
  }

  await t.exception(async () => {
    await powermeter.readValues()
  }, /Read error/)
})

test('ABBPowerMeter _readValues - default implementation', async (t) => {
  const mockClient = { end: () => {} }
  const getClient = () => mockClient
  const opts = { address: '127.0.0.1', port: 502, unitId: 1, timeout: 5000 }

  const powermeter = new ABBPowerMeter({ getClient, ...opts })

  const result = await powermeter._readValues()

  t.is(result, undefined)
})

test('ABBPowerMeter stop method', (t) => {
  let clientEndCalled = false
  const mockClient = {
    end: () => { clientEndCalled = true }
  }
  const getClient = () => mockClient
  const opts = { address: '127.0.0.1', port: 502, unitId: 1, timeout: 5000 }

  const powermeter = new ABBPowerMeter({ getClient, ...opts })
  powermeter.close()

  t.ok(clientEndCalled)
})
