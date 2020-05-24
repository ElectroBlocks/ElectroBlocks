import { FrameGenerator } from '../../frame.factories';
import { MotionSensor } from '../../../../blockly/dto/sensors.data';
import { UltraSonicSensorState } from '../../../arduino-components.state';
import { findFieldValue } from '../../../../blockly/helpers/block-data.helper';
import { ArduinoComponentType } from '../../../arduino.frame';
import { arduinoStateByComponent } from '../../factory.helpers';

export const ultraSonicSensor: FrameGenerator = (
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
