'use strict'

const WrkPowerMeterRack = require('./lib/worker-base.js')
const B2XPowerMeter = require('./lib/models/b2x')

class WrkPowerMeterRackB24 extends WrkPowerMeterRack {
  getThingType () {
    return super.getThingType() + '-b24'
  }

  _createInstance (thg) {
    return new B2XPowerMeter({
      ...thg.opts,
      getClient: this.modbus_0.getClient.bind(this.modbus_0),
      conf: this.conf.thing.powermeter || {}
    })
  }
}

module.exports = WrkPowerMeterRackB24
