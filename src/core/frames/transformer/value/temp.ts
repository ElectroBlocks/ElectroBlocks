import { ValueGenerator } from '../block-to-value.factories';
import { findComponent } from '../frame-transformer.helpers';
import { TemperatureState } from '../../arduino-components.state';
import { ArduinoComponentType } from '../../arduino.frame';

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
