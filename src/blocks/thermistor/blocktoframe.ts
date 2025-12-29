import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { ThermistorSensor, ThermistorState } from "./state";

export const thermistorSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const sensorDatum = JSON.parse(block.metaData) as ThermistorSensor[];
  const sensorData = sensorDatum.find((d) => d.loop === 1) as ThermistorSensor;
  const tempF = (sensorData.temp * 9) / 5 + 32;
  const thermistorState: ThermistorState = {
    pins: block.pins,
    type: ArduinoComponentType.THERMISTOR,
    temp: sensorData.temp,
    externalResistorsOhms: 10_000,
    setupCommand: `register::th::${block.pins[0]}`,
    tempC: sensorData.temp,
    tempF: tempF,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      thermistorState,
      "Setting up Thermistor",
      previousState
    ),
  ];
};
