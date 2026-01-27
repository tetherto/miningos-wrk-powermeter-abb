'use strict'

module.exports = (v) => {
  v.stats_validate.schema.stats.children = {
    powermeter_specific: {
      type: 'object',
      children: {
        v1_n_v: { type: 'number', enum: [123.4] },
        v2_n_v: { type: 'number', enum: [123.4] },
        v3_n_v: { type: 'number', enum: [123.4] },
        v1_v2_v: { type: 'number', enum: [123.4] },
        v2_v3_v: { type: 'number', enum: [123.4] },
        v1_v3_v: { type: 'number', enum: [123.4] },
        i1_a: { type: 'number', enum: [12.34] },
        i2_a: { type: 'number', enum: [12.34] },
        i3_a: { type: 'number', enum: [12.34] },
        in_a: { type: 'number', enum: [12.34] },
        active_power_total_w: { type: 'number', enum: [12.34] },
        reactive_power_total_var: { type: 'number', enum: [12.34] }
      }
    }
  }
}
