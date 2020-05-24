import { ValueGenerator } from '../../value.factories';
import { findComponent } from '../../factory.helpers';
import { TemperatureState } from '../../../state/arduino-components.state';
import { ArduinoComponentType } from '../../../arduino.frame';

export const getTemp: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<TemperatureState>(
    previousState,
    ArduinoComponentType.TEMPERATURE_SENSOR
  ).temperature;
};

export const getHumidity: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<TemperatureState>(
    previousState,
    ArduinoComponentType.TEMPERATURE_SENSOR
  ).humidity;
};
