'use strict'

function createMockClient ({ read, write } = {}) {
  const mockClient = {
    end: () => {}
  }

  if (read) {
    mockClient.read = read
  }

  if (write) {
    mockClient.write = write
  }

  return mockClient
}

function createGetClient (mockClient) {
  return () => mockClient
}

const DEFAULT_OPTS = {
  address: '127.0.0.1',
  port: 502,
  unitId: 1,
  timeout: 5000
}

function createPowermeter (PowerMeterClass, { mockClient, opts } = {}) {
  const client = mockClient || createMockClient()
  const getClient = createGetClient(client)
  const finalOpts = { ...DEFAULT_OPTS, ...opts }

  return new PowerMeterClass({ getClient, ...finalOpts })
}

function createReadTrackingClient (readResponse) {
  const readCalls = []
  const mockClient = createMockClient({
    read: async (functionCode, address, length) => {
      readCalls.push({ functionCode, address, length })
      if (readResponse) {
        return readResponse(functionCode, address, length)
      }
      return Buffer.alloc(length * 2) // Default: 2 bytes per register
    }
  })

  return { mockClient, readCalls }
}

function createWriteTrackingClient () {
  const tracking = {
    writeCalled: false,
    writeParams: null
  }

  const mockClient = createMockClient({
    write: async (address, data) => {
      tracking.writeCalled = true
      tracking.writeParams = { address, data }
    }
  })

  return { mockClient, tracking }
}

function createMultiWriteTrackingClient () {
  const writeCalls = []

  const mockClient = createMockClient({
    write: async (address, data) => {
      writeCalls.push({ address, data })
    }
  })

  return { mockClient, writeCalls }
}

function createB2XTestData (values = {}) {
  const testData = Buffer.alloc(120)
  const defaults = {
    v1_n_v: 2300,
    v2_n_v: 2400,
    v3_n_v: 2500,
    v1_v2_v: 4100,
    v2_v3_v: 4200,
    v1_v3_v: 4300,
    i1_a: 1000,
    i2_a: 1100,
    i3_a: 1200,
    in_a: 500,
    active_power_total_w: 50000,
    reactive_power_total_var: 10000
  }

  const finalValues = { ...defaults, ...values }

  testData.writeUInt32BE(finalValues.v1_n_v, 0)
  testData.writeUInt32BE(finalValues.v2_n_v, 4)
  testData.writeUInt32BE(finalValues.v3_n_v, 8)
  testData.writeUInt32BE(finalValues.v1_v2_v, 12)
  testData.writeUInt32BE(finalValues.v2_v3_v, 16)
  testData.writeUInt32BE(finalValues.v1_v3_v, 20)
  testData.writeUInt32BE(finalValues.i1_a, 24)
  testData.writeUInt32BE(finalValues.i2_a, 28)
  testData.writeUInt32BE(finalValues.i3_a, 32)
  testData.writeUInt32BE(finalValues.in_a, 36)
  testData.writeInt32BE(finalValues.active_power_total_w, 40)
  testData.writeInt32BE(finalValues.reactive_power_total_var, 56)

  return testData
}

function createM1M20TestData (values = {}) {
  const testData = Buffer.alloc(68)
  const defaults = {
    v1_n_v: 2300,
    v2_n_v: 2400,
    v3_n_v: 2500,
    v1_v2_v: 4100,
    v2_v3_v: 4200,
    v3_v1_v: 4300,
    i1_a: 1000,
    i2_a: 1100,
    i3_a: 1200,
    in_a: 500,
    active_power_total_w: 50000,
    reactive_power_total_var: 10000
  }

  const finalValues = { ...defaults, ...values }

  testData.writeUInt32BE(finalValues.v1_n_v, 4)
  testData.writeUInt32BE(finalValues.v2_n_v, 8)
  testData.writeUInt32BE(finalValues.v3_n_v, 12)
  testData.writeUInt32BE(finalValues.v1_v2_v, 16)
  testData.writeUInt32BE(finalValues.v2_v3_v, 20)
  testData.writeUInt32BE(finalValues.v3_v1_v, 24)
  testData.writeUInt32BE(finalValues.i1_a, 32)
  testData.writeUInt32BE(finalValues.i2_a, 36)
  testData.writeUInt32BE(finalValues.i3_a, 40)
  testData.writeUInt32BE(finalValues.in_a, 44)
  testData.writeInt32BE(finalValues.active_power_total_w, 48)
  testData.writeInt32BE(finalValues.reactive_power_total_var, 64)

  return testData
}

function createREU615TestData (powerValue = 50000, voltageValue = 34500) {
  const testData = Buffer.alloc(8)
  testData.writeInt32BE(powerValue, 0)
  testData.writeUInt32BE(voltageValue, 4)
  return testData
}

module.exports = {
  createMockClient,
  createGetClient,
  DEFAULT_OPTS,
  createPowermeter,
  createReadTrackingClient,
  createWriteTrackingClient,
  createMultiWriteTrackingClient,
  createB2XTestData,
  createM1M20TestData,
  createREU615TestData
}
