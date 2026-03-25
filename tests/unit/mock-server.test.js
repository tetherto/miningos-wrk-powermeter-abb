'use strict'

const test = require('brittle')
const { createServer } = require('../../mock/server')

test('createServer throws ERR_UNSUPPORTED for unknown type', (t) => {
  t.exception(
    () =>
      createServer({ host: '127.0.0.1', port: 50299, type: 'not-a-meter' }),
    /ERR_UNSUPPORTED/
  )
})

test('createServer returns lifecycle API for b23', (t) => {
  const srv = createServer({ host: '127.0.0.1', port: 50301, type: 'b23' })
  t.ok(srv.exit)
  t.ok(srv.stop)
  t.ok(srv.start)
  t.ok(srv.reset)
  t.ok(srv.cleanup)
  srv.stop()
  srv.exit()
})
