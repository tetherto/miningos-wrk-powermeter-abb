'use strict'

const test = require('brittle')
const {
  strToAsciiBuffer,
  getRandomPower,
  getActivePower,
  cleanup,
  randomNumber
} = require('../../mock/lib')

test('strToAsciiBuffer - converts string to buffer', (t) => {
  const buf = strToAsciiBuffer('AB')
  t.alike([...buf], [65, 66])
})

test('randomNumber - respects min and max', (t) => {
  for (let i = 0; i < 20; i++) {
    const n = randomNumber(10, 20)
    t.ok(n >= 10 && n <= 20)
  }
})

test('getRandomPower returns a number', (t) => {
  const p = getRandomPower()
  t.ok(typeof p === 'number')
})

test('getActivePower - has totals and phases', (t) => {
  const ap = getActivePower()
  t.ok('active_power_l1_w' in ap)
  t.ok('active_power_l2_w' in ap)
  t.ok('active_power_l3_w' in ap)
  t.is(
    ap.active_power_total_w,
    ap.active_power_l1_w + ap.active_power_l2_w + ap.active_power_l3_w
  )
})

test('cleanup - resets state from initial snapshot', (t) => {
  const initial = { a: 1 }
  const state = { a: 99, b: 2 }
  const out = cleanup(state, initial)
  t.is(out.a, 1)
  t.is(out.b, 2)
})
