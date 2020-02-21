import { StateGenerator } from './state.factories';
import { MotionSensor } from '../../blockly/state/sensors.state';
import { UltraSonicSensorState } from '../state/arduino-components.state';
import { findFieldValue } from '../../blockly/helpers/block-data.helper';
import { ArduinoComponentType } from '../state/arduino.state';
import { createArduinoState } from './factory.helpers';

export const ultraSonicSensor: StateGenerator = (
  blocks,
  block,
  timeline,
  previousState
) => {
  const sensorDatum = JSON.parse(block.metaData) as MotionSensor[];
  const sensorData = sensorDatum.find((d) => d.loop === 1) as MotionSensor;

  const ultraSonicState: UltraSonicSensorState = {
    cm: sensorData.cm,
    pins: block.pins,
    trigPin: findFieldValue(block, 'TRIG'),
    echoPin: findFieldValue(block, 'ECHO'),
    type: ArduinoComponentType.ULTRASONICE_SENSOR
  };

  return [
    createArduinoState(
      block.id,
      timeline,
      ultraSonicState,
      'Setting up ultra sonic sensor.'
    )
  ];
};
