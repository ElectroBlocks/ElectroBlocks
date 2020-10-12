import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import { DigitalPictureType, DigitalSensor, DigitalSensorState } from "./state";

export const digitalReadSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const digitalSensorInfo = JSON.parse(block.metaData) as DigitalSensor[];
  const digitalSensor1 = digitalSensorInfo.find((d) => d.loop === 1);

  const pin = findFieldValue(block, "PIN");
  const pictureType = findFieldValue(block, "TYPE") as DigitalPictureType;
  const sensorType =
    pictureType === DigitalPictureType.TOUCH_SENSOR ? "touch" : "digital";
  const explanation = `Setting up ${sensorType} sensor ${pin}.`;

  const digitalSensorState: DigitalSensorState = {
    type: ArduinoComponentType.DIGITAL_SENSOR,
    pin,
    pins: [pin],
    isOn: digitalSensor1.isOn,
    pictureType,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      digitalSensorState,
      explanation,
      previousState
    ),
  ];
};
