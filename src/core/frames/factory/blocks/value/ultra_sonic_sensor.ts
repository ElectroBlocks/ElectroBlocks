import { ValueGenerator } from '../../value.factories';
import { findComponent } from '../../factory.helpers';
import { UltraSonicSensorState } from '../../../state/arduino-components.state';
import { ArduinoComponentType } from '../../../state/arduino.state';

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
