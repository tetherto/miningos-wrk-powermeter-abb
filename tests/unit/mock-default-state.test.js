'use strict'

const test = require('brittle')
const createDefaultState = require('../../mock/initial_states/default')

test('default initial state - read-holding-registers in buffer5 range', (t) => {
  const { bind } = createDefaultState()
  const handlers = {}
  const connection = {
    on: (event, fn) => {
      handlers[event] = fn
    }
  }
  bind(connection)

  let replied = null
  const reply = (err, buf) => {
    replied = { err, buf }
  }

  handlers['read-holding-registers'](
    { request: { address: 0x5000, quantity: 1 } },
    reply
  )

  t.absent(replied.err)
  t.ok(replied.buf)
  t.is(replied.buf.length, 2)
})

test('default initial state - write-single-register', (t) => {
  const { bind } = createDefaultState()
  const handlers = {}
  bind({
    on: (event, fn) => {
      handlers[event] = fn
    }
  })

  let replied = null
  handlers['write-single-register'](
    { request: { address: 100, value: 42 } },
    (err, val) => {
      replied = { err, val }
    }
  )

  t.absent(replied.err)
  t.is(replied.val, 42)
})

test('default initial state - write-multiple-registers', (t) => {
  const { bind } = createDefaultState()
  const handlers = {}
  bind({
    on: (event, fn) => {
      handlers[event] = fn
    }
  })

  const values = [1, 2, 3]
  let replied = null
  handlers['write-multiple-registers'](
    { request: { address: 200, quantity: 3, values } },
    (err, out) => {
      replied = { err, out }
    }
  )

  t.absent(replied.err)
  t.alike(replied.out, values)
})
