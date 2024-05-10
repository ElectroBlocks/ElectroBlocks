import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import {
  AnalogSensorPicture,
  type AnalogSensor,
  type AnalogSensorState,
} from "./state";

export const analogReadSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const analogSensorInfo = JSON.parse(block.metaData) as AnalogSensor[];
  const analogSensor1 = analogSensorInfo.find((d) => d.loop === 1);

  const pin = findFieldValue(block, "PIN");
  const pictureType = findFieldValue(block, "TYPE") as AnalogSensorPicture;
  const sensorType = getSensorText(pictureType);
  const explanation = `Setting up ${sensorType} sensor ${pin}.`;

  const analogSensorState: AnalogSensorState = {
    type: ArduinoComponentType.ANALOG_SENSOR,
    pin,
    pins: [pin],
    state: analogSensor1.state,
    pictureType,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      analogSensorState,
      explanation,
      previousState
    ),
  ];
};

const getSensorText = (type: AnalogSensorPicture) => {
  switch (type) {
    case AnalogSensorPicture.PHOTO_SENSOR:
      return "photo";
    case AnalogSensorPicture.SOIL_SENSOR:
      return "soil";
    default:
      return "analog";
  }
};
