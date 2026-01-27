'use strict'

const WrkPowerMeterRack = require('./lib/worker-base.js')
const REU615PowerMeter = require('./lib/models/reu615')

class WrkPowerMeterRackREU615 extends WrkPowerMeterRack {
  getThingType () {
    return super.getThingType() + '-reu615'
  }

  _createInstance (thg) {
    return new REU615PowerMeter({
      ...thg.opts,
      getClient: this.modbus_0.getClient.bind(this.modbus_0),
      conf: this.conf.thing.powermeter || {}
    })
  }
}

module.exports = WrkPowerMeterRackREU615
