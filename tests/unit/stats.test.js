'use strict'

const test = require('brittle')
const libStats = require('../../workers/lib/stats')

test('stats module exports libStats', (t) => {
  t.ok(libStats)
  t.ok(typeof libStats === 'object')
})

test('stats module has powermeter specs', (t) => {
  t.ok(libStats.specs)
  t.ok(libStats.specs.powermeter)
  t.ok(libStats.specs.powermeter.ops)
})

test('powermeter specs has site_power_w operation', (t) => {
  const powermeterSpecs = libStats.specs.powermeter

  t.ok(powermeterSpecs.ops.site_power_w)
  t.is(powermeterSpecs.ops.site_power_w.op, 'sum')
  t.is(powermeterSpecs.ops.site_power_w.src, 'last.snap.stats.power_w')
  t.ok(typeof powermeterSpecs.ops.site_power_w.filter === 'function')
})

test('site_power_w filter function - matches site position', (t) => {
  const filter = libStats.specs.powermeter.ops.site_power_w.filter

  const entry = { some: 'data' }
  const ext = { info: { pos: 'site' } }

  const result = filter(entry, ext)

  t.ok(result)
})

test('site_power_w filter function - does not match non-site position', (t) => {
  const filter = libStats.specs.powermeter.ops.site_power_w.filter

  const entry = { some: 'data' }
  const ext = { info: { pos: 'rack' } }

  const result = filter(entry, ext)

  t.not(result)
})

test('site_power_w filter function - handles undefined ext', (t) => {
  const filter = libStats.specs.powermeter.ops.site_power_w.filter

  const entry = { some: 'data' }
  const ext = undefined

  const result = filter(entry, ext)

  t.not(result)
})

test('site_power_w filter function - handles undefined ext.info', (t) => {
  const filter = libStats.specs.powermeter.ops.site_power_w.filter

  const entry = { some: 'data' }
  const ext = { info: undefined }

  const result = filter(entry, ext)

  t.not(result)
})

test('site_power_w filter function - handles undefined ext.info.pos', (t) => {
  const filter = libStats.specs.powermeter.ops.site_power_w.filter

  const entry = { some: 'data' }
  const ext = { info: { pos: undefined } }

  const result = filter(entry, ext)

  t.not(result)
})

test('site_power_w filter function - handles null ext', (t) => {
  const filter = libStats.specs.powermeter.ops.site_power_w.filter

  const entry = { some: 'data' }
  const ext = null

  const result = filter(entry, ext)

  t.not(result)
})

test('site_power_w filter function - handles empty ext object', (t) => {
  const filter = libStats.specs.powermeter.ops.site_power_w.filter

  const entry = { some: 'data' }
  const ext = {}

  const result = filter(entry, ext)

  t.not(result)
})

test('site_power_w filter function - case sensitive position matching', (t) => {
  const filter = libStats.specs.powermeter.ops.site_power_w.filter

  const entry = { some: 'data' }

  // Test various case variations
  const testCases = [
    { pos: 'Site', expected: false },
    { pos: 'SITE', expected: false },
    { pos: 'site', expected: true },
    { pos: 'sites', expected: false },
    { pos: 'site-1', expected: false }
  ]

  for (const testCase of testCases) {
    const ext = { info: { pos: testCase.pos } }
    const result = filter(entry, ext)

    t.is(result, testCase.expected, `Position "${testCase.pos}" should ${testCase.expected ? 'match' : 'not match'}`)
  }
})

test('powermeter specs structure validation', (t) => {
  const powermeterSpecs = libStats.specs.powermeter

  // Check that ops is an object
  t.ok(typeof powermeterSpecs.ops === 'object')
  t.not(Array.isArray(powermeterSpecs.ops))

  // Check that site_power_w operation has all required properties
  const sitePowerOp = powermeterSpecs.ops.site_power_w
  t.ok(sitePowerOp)
  t.is(typeof sitePowerOp.op, 'string')
  t.is(typeof sitePowerOp.src, 'string')
  t.is(typeof sitePowerOp.filter, 'function')

  // Check that op is 'sum'
  t.is(sitePowerOp.op, 'sum')

  // Check that src follows expected pattern
  t.ok(sitePowerOp.src.includes('last.snap.stats.power_w'))
})
