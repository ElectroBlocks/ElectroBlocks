import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { ValueGenerator } from "../../core/frames/transformer/block-to-value.factories";
import { findComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { TemperatureState } from "./state";

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
