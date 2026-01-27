'use strict'

const { getDefaultConf, testExecutor } = require('miningos-tpl-wrk-powermeter/tests/powermeter.test')
const B2XPowerMeter = require('../workers/lib/models/b2x')
const ModbusFacility = require('svc-facs-modbus')

let mock

const conf = getDefaultConf()
if (!conf.settings.live) {
  conf.settings.host = '127.0.0.1'
  const srv = require('../mock/server')
  mock = srv.createServer({
    host: conf.settings.host,
    port: conf.settings.port,
    type: 'B23'
  })
}

const fac = new ModbusFacility({ ctx: { env: 'test', root: '.' } }, {}, { env: 'test', root: '.' })
const powermeter = new B2XPowerMeter({
  getClient: fac.getClient.bind(fac),
  address: conf.settings.host,
  port: conf.settings.port,
  unitId: 0
})

conf.cleanup = () => {
  if (mock) {
    mock.stop()
  }
  powermeter.close()
}

async function execute () {
  testExecutor(powermeter, conf)
}

execute()
