import { ValueGenerator } from '../block-to-value.factories';
import { findComponent } from '../frame-transformer.helpers';
import { UltraSonicSensorState } from '../../arduino-components.state';
import { ArduinoComponentType } from '../../arduino.frame';

export const ultraSonicSensorDistance: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<UltraSonicSensorState>(
    previousState,
    ArduinoComponentType.ULTRASONICE_SENSOR
  ).cm;
};
