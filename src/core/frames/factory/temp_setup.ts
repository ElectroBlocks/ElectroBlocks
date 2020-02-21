import { StateGenerator } from './state.factories';
import { MotionSensor, TempSensor } from '../../blockly/state/sensors.state';
import {  TemperatureState } from '../state/arduino-components.state';
import { findFieldValue } from '../../blockly/helpers/block-data.helper';
import { ArduinoComponentType } from '../state/arduino.state';
import { createArduinoState } from './factory.helpers';

export const tempSetupSensor: StateGenerator = (
  blocks,
  block,
  timeline,
  previousState
) => {
  const sensorDatum = JSON.parse(block.metaData) as TempSensor[];
  const sensorData = sensorDatum.find((d) => d.loop === 1) as TempSensor;

  const tempSensorState: TemperatureState = {
    pins: block.pins,
    temperature: sensorData.temp,
    humidity: sensorData.humidity,
    type: ArduinoComponentType.TEMPERATURE_SENSOR
  };

  return [
    createArduinoState(
      block.id,
      timeline,
      tempSensorState,
      'Setting up temperature sensor.'
    )
  ];
};
