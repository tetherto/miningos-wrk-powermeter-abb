'use strict'

const test = require('brittle')
const {
  obisToBytes,
  buildActionConfig,
  parseActionConfig,
  buildAlarmConfig,
  asciiBufferToStr,
  bufferToBitString,
  ACTION_TYPES
} = require('../../workers/lib/utils')

test('obisToBytes - valid OBIS code', (t) => {
  const obisCode = '1.2.3.4.5.6'
  const result = obisToBytes(obisCode)

  t.ok(Buffer.isBuffer(result))
  t.is(result.length, 6)
  t.is(result[0], 1)
  t.is(result[1], 2)
  t.is(result[2], 3)
  t.is(result[3], 4)
  t.is(result[4], 5)
  t.is(result[5], 6)
})

test('buildActionConfig - single action type', (t) => {
  const actionConfig = {
    types: ['writeLog'],
    output: 5
  }
  const buffer = Buffer.alloc(2)

  buildActionConfig(actionConfig, buffer)

  t.is(buffer.readUInt8(0), ACTION_TYPES.writeLog)
  t.is(buffer.readUInt8(1), 5)
})

test('buildActionConfig - multiple action types', (t) => {
  const actionConfig = {
    types: ['writeLog', 'setOutput'],
    output: 3
  }
  const buffer = Buffer.alloc(2)

  buildActionConfig(actionConfig, buffer)

  t.is(buffer.readUInt8(0), ACTION_TYPES.writeLog | ACTION_TYPES.setOutput)
  t.is(buffer.readUInt8(1), 3)
})

test('buildActionConfig - all action types', (t) => {
  const actionConfig = {
    types: ['writeLog', 'setOutput', 'setAlarmBit'],
    output: 7
  }
  const buffer = Buffer.alloc(2)

  buildActionConfig(actionConfig, buffer)

  t.is(buffer.readUInt8(0), ACTION_TYPES.writeLog | ACTION_TYPES.setOutput | ACTION_TYPES.setAlarmBit)
  t.is(buffer.readUInt8(1), 7)
})

test('parseActionConfig - single action type', (t) => {
  const buffer = Buffer.alloc(2)
  buffer.writeUInt8(ACTION_TYPES.writeLog, 0)
  buffer.writeUInt8(5, 1)

  const result = parseActionConfig(buffer)

  t.alike(result.types, ['writeLog'])
  t.is(result.output, 5)
})

test('parseActionConfig - multiple action types', (t) => {
  const buffer = Buffer.alloc(2)
  buffer.writeUInt8(ACTION_TYPES.writeLog | ACTION_TYPES.setOutput, 0)
  buffer.writeUInt8(3, 1)

  const result = parseActionConfig(buffer)
  t.is(result.output, 3)
})

test('parseActionConfig - all action types', (t) => {
  const buffer = Buffer.alloc(2)
  buffer.writeUInt8(ACTION_TYPES.writeLog | ACTION_TYPES.setOutput | ACTION_TYPES.setAlarmBit, 0)
  buffer.writeUInt8(7, 1)

  const result = parseActionConfig(buffer)
  t.is(result.output, 7)
})

test('buildAlarmConfig - complete alarm configuration', (t) => {
  const alarmConfig = {
    index: 123,
    quantity: '1.2.3.4.5.6',
    limit_on: 1000n,
    limit_off: 500n,
    delay_on: 30,
    delay_off: 60,
    action: {
      types: ['writeLog', 'setOutput'],
      output: 2
    }
  }

  const packets = buildAlarmConfig(alarmConfig)

  t.is(packets.length, 5)

  // Check index packet
  t.is(packets[0].readUInt16BE(0), 123)

  // Check quantity packet (OBIS bytes)
  t.alike([...packets[1]], [1, 2, 3, 4, 5, 6])

  // Check limits packet
  t.is(packets[2].readBigInt64BE(0), 1000n)
  t.is(packets[2].readBigInt64BE(8), 500n)

  // Check delays packet
  t.is(packets[3].readUInt32BE(0), 30)
  t.is(packets[3].readUInt32BE(4), 60)

  // Check action packet
  t.is(packets[4].readUInt8(0), ACTION_TYPES.writeLog | ACTION_TYPES.setOutput)
  t.is(packets[4].readUInt8(1), 2)
})

test('asciiBufferToStr - normal ASCII characters', (t) => {
  const buffer = Buffer.from('Hello World', 'ascii')
  const result = asciiBufferToStr(buffer)

  t.is(result, 'Hello World')
})

test('asciiBufferToStr - with null bytes', (t) => {
  const buffer = Buffer.from([72, 101, 108, 108, 111, 0, 87, 111, 114, 108, 100, 0, 0])
  const result = asciiBufferToStr(buffer)

  t.is(result, 'HelloWorld')
})

test('asciiBufferToStr - all null bytes', (t) => {
  const buffer = Buffer.from([0, 0, 0, 0])
  const result = asciiBufferToStr(buffer)

  t.is(result, '')
})

test('asciiBufferToStr - empty buffer', (t) => {
  const buffer = Buffer.alloc(0)
  const result = asciiBufferToStr(buffer)

  t.is(result, '')
})

test('bufferToBitString - single byte', (t) => {
  const buffer = Buffer.from([0b10101010])
  const result = bufferToBitString(buffer)

  t.is(result, '10101010')
})

test('bufferToBitString - multiple bytes', (t) => {
  const buffer = Buffer.from([0b10101010, 0b11001100])
  const result = bufferToBitString(buffer)

  t.is(result, '1010101011001100')
})

test('bufferToBitString - zero bytes', (t) => {
  const buffer = Buffer.from([0b00000000, 0b00000000])
  const result = bufferToBitString(buffer)

  t.is(result, '0000000000000000')
})

test('bufferToBitString - max bytes', (t) => {
  const buffer = Buffer.from([0b11111111, 0b11111111])
  const result = bufferToBitString(buffer)

  t.is(result, '1111111111111111')
})

test('ACTION_TYPES constants', (t) => {
  t.is(ACTION_TYPES.writeLog, 0b001)
  t.is(ACTION_TYPES.setOutput, 0b010)
  t.is(ACTION_TYPES.setAlarmBit, 0b100)
})
