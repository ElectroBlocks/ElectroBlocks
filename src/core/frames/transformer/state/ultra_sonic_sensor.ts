import { BlockToFrameTransformer } from '../block-to-frame.transformer';
import { MotionSensor } from '../../../blockly/dto/sensors.type';
import { UltraSonicSensorState } from '../../arduino-components.state';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';
import { ArduinoComponentType } from '../../arduino.frame';
import { arduinoStateByComponent } from '../frame-transformer.helpers';

export const ultraSonicSensor: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
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
    type: ArduinoComponentType.ULTRASONICE_SENSOR,
  };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      ultraSonicState,
      'Setting up ultra sonic sensor.'
    ),
  ];
};
