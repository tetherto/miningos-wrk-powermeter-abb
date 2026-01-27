'use strict'

const WrkPowerMeterRack = require('./lib/worker-base.js')
const M1M20PowerMeter = require('./lib/models/m1m20')

class WrkPowerMeterRackM1M20 extends WrkPowerMeterRack {
  getThingType () {
    return super.getThingType() + '-m1m20'
  }

  _createInstance (thg) {
    return new M1M20PowerMeter({
      ...thg.opts,
      getClient: this.modbus_0.getClient.bind(this.modbus_0),
      conf: this.conf.thing.powermeter || {}
    })
  }
}

module.exports = WrkPowerMeterRackM1M20
