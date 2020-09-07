import { BlockToFrameTransformer } from "../block-to-frame.transformer";
import {
  getDefaultIndexValue,
  findComponent,
  arduinoFrameByComponent,
} from "../frame-transformer.helpers";
import { getInputValue } from "../block-to-value.factories";
import { ARDUINO_UNO_PINS } from "../../../microcontroller/selectBoard";
import { ArduinoFrame, ArduinoComponentType } from "../../arduino.frame";
import { ServoState } from "../../arduino-components.state";
import { findFieldValue } from "../../../blockly/helpers/block-data.helper";

export const servoRotate: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const degree = getDefaultIndexValue(
    0,
    5000,
    getInputValue(
      blocks,
      block,
      variables,
      timeline,
      "DEGREE",
      1,
      previousState
    )
  );

  const newComponent = getServo(
    degree,
    findFieldValue(block, "PIN"),
    previousState
  );

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      newComponent,
      `Servo ${newComponent.pins[0]} is rotating to ${newComponent.degree} degrees.`,
      previousState
    ),
  ];
};

const getServo = (
  degree: number,
  pin: ARDUINO_UNO_PINS,
  previousState: ArduinoFrame
): ServoState => {
  if (!previousState) {
    return { pins: [pin], degree, type: ArduinoComponentType.SERVO };
  }

  const servo = findComponent<ServoState>(
    previousState,
    ArduinoComponentType.SERVO,
    pin
  );

  if (!servo) {
    return { pins: [pin], degree, type: ArduinoComponentType.SERVO };
  }

  return { ...servo, degree };
};
