import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { TemperatureState, TempSensor } from "./state";

export const tempSetupSensor: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const sensorDatum = JSON.parse(block.metaData) as TempSensor[];
  const sensorData = sensorDatum.find((d) => d.loop === 1) as TempSensor;

  const tempSensorState: TemperatureState = {
    pins: block.pins,
    temperature: sensorData.temp,
    humidity: sensorData.humidity,
    type: ArduinoComponentType.TEMPERATURE_SENSOR,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      tempSensorState,
      "Setting up temperature sensor.",
      previousState
    ),
  ];
};
