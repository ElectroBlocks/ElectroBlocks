import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { ArduinoComponentType } from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import { DigitalSensorType, DigitalSensor, DigitalSensorState } from "./state";

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
  const sensorType = findFieldValue(block, "TYPE") as DigitalSensorType;
  let humanSensorWord = "digital";
  if (sensorType == DigitalSensorType.IR_SENSOR) {
    humanSensorWord = "infrared";
  } else if (sensorType == DigitalSensorType.TOUCH_SENSOR) {
    humanSensorWord = "touch";
  }
  const explanation = `Setting up ${humanSensorWord} sensor ${pin}.`;

  const digitalSensorState: DigitalSensorState = {
    type: ArduinoComponentType.DIGITAL_SENSOR,
    pin,
    pins: [pin],
    isOn: digitalSensor1.isOn,
    sensorType,
    setupCommand: `register::dr::${pin}`,
  };
  var frame = arduinoFrameByComponent(
    block.id,
    block.blockName,
    timeline,
    digitalSensorState,
    explanation,
    previousState
  );

  return [frame];
};
