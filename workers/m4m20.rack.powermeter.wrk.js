'use strict'

const WrkPowerMeterRack = require('./lib/worker-base.js')
const M4M20PowerMeter = require('./lib/models/m4m20.js')

class WrkPowerMeterRackM4M20 extends WrkPowerMeterRack {
  getThingType () {
    return super.getThingType() + '-m4m20'
  }

  _createInstance (thg) {
    return new M4M20PowerMeter({
      ...thg.opts,
      getClient: this.modbus_0.getClient.bind(this.modbus_0),
      conf: this.conf.thing.powermeter || {}
    })
  }
}

module.exports = WrkPowerMeterRackM4M20
