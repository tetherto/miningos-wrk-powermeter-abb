# ABB APIs

This document describes the functions exposed by the `powermeter.js` library for ABB. Below are functions common to all powermeters. Look at individual powermeter documentation for specific changes if any. As of now we are not aware of any powermeter specific changes

## powermeter specific documentation
- [ABB B23](./abb-b23.md)
- [ABB B24](./abb-b24.md)

## Common Functions

- [ABB APIs](#abb-apis)
  - [`constructor(host, port, unitId = 0)` -\> `ABBpowermeter`](#constructorhost-port-unitid--0---abbpowermeter)
    - [Parameters](#parameters)
  - [`getSnap()` -\> `Object`](#getsnap---object)
    - [Returns](#returns)
  - [`resetPowerFailCounter()` -\> `Object`](#resetpowerfailcounter---object)
    - [Returns](#returns-1)
  - [`resetPowerOutageTime()` -\> `Object`](#resetpoweroutagetime---object)
    - [Returns](#returns-2)
  - [`resetSystemLog()` -\> `Object`](#resetsystemlog---object)
    - [Returns](#returns-3)
  - [`resetEventLog()` -\> `Object`](#reseteventlog---object)
    - [Returns](#returns-4)
  - [`resetNetQualityLog()` -\> `Object`](#resetnetqualitylog---object)
    - [Returns](#returns-5)
  - [`setAlarmConfig(alarmConfig)` -\> `Object`](#setalarmconfigalarmconfig---object)
    - [Parameters](#parameters-1)
    - [Returns](#returns-6)
  - [`getAlarmConfig(index)` -\> `Object`](#getalarmconfigindex---object)
    - [Parameters](#parameters-2)
    - [Returns](#returns-7)


## `constructor(host, port, unitId = 0)` -> `ABBpowermeter`
Creates a new `ABBpowermeter` instance.

### Parameters
| Param  | Type | Description | Default |
| -- | -- | -- | -- |
| host | `string` | Hostname or IP address of the powermeter. | |
| port | `number` | Port of the powermeter. | |
| unitId | `number` | Unit ID of the powermeter. | `0` |

## `getSnap()` -> `Object`
Gets a snapshot of the powermeter.

### Returns
| Key | Type | Description |
| -- | -- | -- |
| success | `boolean` | `true` if the snapshot was successfully retrieved. |
| stats.powermeter_specific.total_energy_accumulators.active_import_wh | `string` | Total active import energy in Wh. |
| stats.powermeter_specific.total_energy_accumulators.active_export_wh | `string` | Total active export energy in Wh. |
| stats.powermeter_specific.total_energy_accumulators.active_net_wh | `string` | Total active net energy in Wh. |
| stats.powermeter_specific.total_energy_accumulators.reactive_import_varh | `string` | Total reactive import energy in varh. |
| stats.powermeter_specific.total_energy_accumulators.reactive_export_varh | `string` | Total reactive export energy in varh. |
| stats.powermeter_specific.total_energy_accumulators.reactive_net_varh | `string` | Total reactive net energy in varh. |
| stats.powermeter_specific.total_energy_accumulators.apparent_import_vah | `string` | Total apparent import energy in vah. |
| stats.powermeter_specific.total_energy_accumulators.apparent_export_vah | `string` | Total apparent export energy in vah. |
| stats.powermeter_specific.total_energy_accumulators.apparent_net_vah | `string` | Total apparent net energy in vah. |
| stats.powermeter_specific.instantaneous_values.v1_n_v | `number` | Phase 1 to neutral voltage in V. |
| stats.powermeter_specific.instantaneous_values.v2_n_v | `number` | Phase 2 to neutral voltage in V. |
| stats.powermeter_specific.instantaneous_values.v3_n_v | `number` | Phase 3 to neutral voltage in V. |
| stats.powermeter_specific.instantaneous_values.v1_v2_v | `number` | Phase 1 to phase 2 voltage in V. |
| stats.powermeter_specific.instantaneous_values.v2_v3_v | `number` | Phase 2 to phase 3 voltage in V. |
| stats.powermeter_specific.instantaneous_values.v1_v3_v | `number` | Phase 1 to phase 3 voltage in V. |
| stats.powermeter_specific.instantaneous_values.i1_a | `number` | Phase 1 current in A. |
| stats.powermeter_specific.instantaneous_values.i2_a | `number` | Phase 2 current in A. |
| stats.powermeter_specific.instantaneous_values.i3_a | `number` | Phase 3 current in A. |
| stats.powermeter_specific.instantaneous_values.in_a | `number` | Neutral current in A. |
| stats.powermeter_specific.instantaneous_values.active_power_total_w | `number` | Total active power in W. |
| stats.powermeter_specific.instantaneous_values.active_power_l1_w | `number` | Phase 1 active power in W. |
| stats.powermeter_specific.instantaneous_values.active_power_l2_w | `number` | Phase 2 active power in W. |
| stats.powermeter_specific.instantaneous_values.active_power_l3_w | `number` | Phase 3 active power in W. |
| stats.powermeter_specific.instantaneous_values.reactive_power_total_var | `number` | Total reactive power in var. |
| stats.powermeter_specific.instantaneous_values.reactive_power_l1_var | `number` | Phase 1 reactive power in var. |
| stats.powermeter_specific.instantaneous_values.reactive_power_l2_var | `number` | Phase 2 reactive power in var. |
| stats.powermeter_specific.instantaneous_values.reactive_power_l3_var | `number` | Phase 3 reactive power in var. |
| stats.powermeter_specific.instantaneous_values.apparent_power_total_va | `number` | Total apparent power in va. |
| stats.powermeter_specific.instantaneous_values.apparent_power_l1_va | `number` | Phase 1 apparent power in va. |
| stats.powermeter_specific.instantaneous_values.apparent_power_l2_va | `number` | Phase 2 apparent power in va. |
| stats.powermeter_specific.instantaneous_values.apparent_power_l3_va | `number` | Phase 3 apparent power in va. |
| stats.powermeter_specific.instantaneous_values.frequency_hz | `number` | Frequency in Hz. |
| stats.powermeter_specific.instantaneous_values.phase_angle_power_total_deg | `number` | Total phase angle of power in deg. |
| stats.powermeter_specific.instantaneous_values.phase_angle_power_l1_deg | `number` | Phase 1 phase angle of power in deg. |
| stats.powermeter_specific.instantaneous_values.phase_angle_power_l2_deg | `number` | Phase 2 phase angle of power in deg. |
| stats.powermeter_specific.instantaneous_values.phase_angle_power_l3_deg | `number` | Phase 3 phase angle of power in deg. |
| stats.powermeter_specific.instantaneous_values.phase_angle_voltage_l1_deg | `number` | Phase 1 phase angle of voltage in deg. |
| stats.powermeter_specific.instantaneous_values.phase_angle_voltage_l2_deg | `number` | Phase 2 phase angle of voltage in deg. |
| stats.powermeter_specific.instantaneous_values.phase_angle_voltage_l3_deg | `number` | Phase 3 phase angle of voltage in deg. |
| stats.powermeter_specific.instantaneous_values.phase_angle_current_l1_deg | `number` | Phase 1 phase angle of current in deg. |
| stats.powermeter_specific.instantaneous_values.phase_angle_current_l2_deg | `number` | Phase 2 phase angle of current in deg. |
| stats.powermeter_specific.instantaneous_values.phase_angle_current_l3_deg | `number` | Phase 3 phase angle of current in deg. |
| stats.powermeter_specific.instantaneous_values.power_factor_total | `number` | Total power factor. |
| stats.powermeter_specific.instantaneous_values.power_factor_l1 | `number` | Phase 1 power factor. |
| stats.powermeter_specific.instantaneous_values.power_factor_l2 | `number` | Phase 2 power factor. |
| stats.powermeter_specific.instantaneous_values.power_factor_l3 | `number` | Phase 3 power factor. |
| stats.powermeter_specific.identification_data.serial_num | `number` | Serial number. |
| stats.powermeter_specific.identification_data.firmware_ver | `string` | Firmware version. |
| stats.powermeter_specific.identification_data.modbus_mapping_ver | `string` | Modbus mapping version. |
| stats.powermeter_specific.miscellaneous.error_flags | `Array<boolean>` | Error flags. |
| stats.powermeter_specific.miscellaneous.warning_flags | `Array<boolean>` | Warning flags. |
| stats.powermeter_specific.miscellaneous.alarm_flags | `Array<boolean>` | Alarm flags. |
| stats.powermeter_specific.settings.current_transformer_ratio_numerator | `number` | Current transformer ratio numerator. |
| stats.powermeter_specific.settings.current_transformer_ratio_denominator | `number` | Current transformer ratio denominator. |
| stats.powermeter_specific.settings.currency_conversion_factor | `number` | Currency conversion factor. |
| stats.powermeter_specific.dmtme._3_phase_system_voltage_v | `number` | 3 phase system voltage in V. |
| stats.powermeter_specific.dmtme.phase_voltage_l1_n_v | `number` | Phase voltage L1 to neutral in V. |
| stats.powermeter_specific.dmtme.phase_voltage_l2_n_v | `number` | Phase voltage L2 to neutral in V. |
| stats.powermeter_specific.dmtme.phase_voltage_l3_n_v | `number` | Phase voltage L3 to neutral in V. |
| stats.powermeter_specific.dmtme.line_voltage_l1_l2_v | `number` | Line voltage L1 to L2 in V. |
| stats.powermeter_specific.dmtme.line_voltage_l2_l3_v | `number` | Line voltage L2 to L3 in V. |
| stats.powermeter_specific.dmtme.line_voltage_l1_l3_v | `number` | Line voltage L1 to L3 in V. |
| stats.powermeter_specific.dmtme.line_current_l1_a | `number` | Line current L1 in A. |
| stats.powermeter_specific.dmtme.line_current_l2_a | `number` | Line current L2 in A. |
| stats.powermeter_specific.dmtme.line_current_l3_a | `number` | Line current L3 in A. |
| stats.powermeter_specific.dmtme._3_phase_system_power_factor | `number` | 3 phase system power factor. |
| stats.powermeter_specific.dmtme.power_factor_l1 | `number` | Power factor L1. |
| stats.powermeter_specific.dmtme.power_factor_l2 | `number` | Power factor L2. |
| stats.powermeter_specific.dmtme.power_factor_l3 | `number` | Power factor L3. |
| stats.powermeter_specific.dmtme._3_phase_system_apparent_power_va | `number` | 3 phase system apparent power in VA. |
| stats.powermeter_specific.dmtme.apparent_power_l1_va | `number` | Apparent power L1 in VA. |
| stats.powermeter_specific.dmtme.apparent_power_l2_va | `number` | Apparent power L2 in VA. |
| stats.powermeter_specific.dmtme.apparent_power_l3_va | `number` | Apparent power L3 in VA. |
| stats.powermeter_specific.dmtme._3_phase_system_active_power_w | `number` | 3 phase system active power in W. |
| stats.powermeter_specific.dmtme.active_power_l1_w | `number` | Active power L1 in W. |
| stats.powermeter_specific.dmtme.active_power_l2_w | `number` | Active power L2 in W. |
| stats.powermeter_specific.dmtme.active_power_l3_w | `number` | Active power L3 in W. |
| stats.powermeter_specific.dmtme._3_phase_system_reactive_power_var | `number` | 3 phase system reactive power in var. |
| stats.powermeter_specific.dmtme.reactive_power_l1_var | `number` | Reactive power L1 in var. |
| stats.powermeter_specific.dmtme.reactive_power_l2_var | `number` | Reactive power L2 in var. |
| stats.powermeter_specific.dmtme.reactive_power_l3_var | `number` | Reactive power L3 in var. |
| stats.powermeter_specific.dmtme._3_phase_system_active_energy_wh | `number` | 3 phase system active energy in Wh. |
| stats.powermeter_specific.dmtme._3_phase_system_reactive_energy_varh | `number` | 3 phase system reactive energy in varh. |
| stats.powermeter_specific.dmtme.frequency_hz | `number` | Frequency in Hz. |
| stats.powermeter_specific.dmtme.current_transformer_ratio | `number` | Current transformer ratio. |

## `resetPowerFailCounter()` -> `Object`
Resets the power fail counter.

### Returns
| Key | Type | Description |
| -- | -- | -- |
| success | `boolean` | `true` if the power fail counter was successfully reset. |

## `resetPowerOutageTime()` -> `Object`
Resets the power outage time.

### Returns
| Key | Type | Description |
| -- | -- | -- |
| success | `boolean` | `true` if the power outage time was successfully reset. |

## `resetSystemLog()` -> `Object`
Resets the system log.

### Returns
| Key | Type | Description |
| -- | -- | -- |
| success | `boolean` | `true` if the system log was successfully reset. |

## `resetEventLog()` -> `Object`
Resets the event log.

### Returns
| Key | Type | Description |
| -- | -- | -- |
| success | `boolean` | `true` if the event log was successfully reset. |

## `resetNetQualityLog()` -> `Object`
Resets the net quality log.

### Returns
| Key | Type | Description |
| -- | -- | -- |
| success | `boolean` | `true` if the net quality log was successfully reset. |

## `setAlarmConfig(alarmConfig)` -> `Object`
Sets the alarm configuration.

### Parameters
| Param  | Type | Description |
| -- | -- | -- |
| alarmConfig.index | `number` | Alarm index. (`1` - `25`) |
| alarmConfig.quantity | `string` | OBIS Code of quantity. |
| alarmConfig.limit_on | `number` | Alarm limit to trigger ON. |
| alarmConfig.limit_off | `number` | Alarm limit to trigger OFF. |
| alarmConfig.delay_on | `number` | Alarm delay to trigger ON. |
| alarmConfig.delay_off | `number` | Alarm delay to trigger OFF. |
| alarmConfig.action.types | `Array<string>` | Alarm action types. Can have `writeLog`, `setOutput`, `setAlarmBit`. |
| alarmConfig.action.output | `number` | Alarm action output register. (`1` - `4`) |

### Returns
| Key | Type | Description |
| -- | -- | -- |
| success | `boolean` | `true` if the alarm configuration was successfully set. |

## `getAlarmConfig(index)` -> `Object`
Gets the alarm configuration.

### Parameters
| Param  | Type | Description |
| -- | -- | -- |
| index | `number` | Alarm index. (`1` - `25`) |

### Returns
| Key | Type | Description |
| -- | -- | -- |
| success | `boolean` | `true` if the alarm configuration was successfully retrieved. |
| alarm_config.index | `number` | Alarm index. (`1` - `25`) |
| alarm_config.quantity | `string` | OBIS Code of quantity. |
| alarm_config.limit_on | `number` | Alarm limit to trigger ON. |
| alarm_config.limit_off | `number` | Alarm limit to trigger OFF. |
| alarm_config.delay_on | `number` | Alarm delay to trigger ON. |
| alarm_config.delay_off | `number` | Alarm delay to trigger OFF. |
| alarm_config.action.types | `Array<string>` | Alarm action types. Can have `writeLog`, `setOutput`, `setAlarmBit`. |
| alarm_config.action.output | `number` | Alarm action output register. (`1` - `4`) |
