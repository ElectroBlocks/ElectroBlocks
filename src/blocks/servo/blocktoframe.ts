import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import {
  ArduinoComponentType,
  ArduinoFrame,
} from "../../core/frames/arduino.frame";
import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import { getInputValue } from "../../core/frames/transformer/block-to-value.factories";
import {
  arduinoFrameByComponent,
  findComponent,
  getDefaultIndexValue,
} from "../../core/frames/transformer/frame-transformer.helpers";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import type { ServoState } from "./state";

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

  newComponent.importLibraries = [
    {
      name: "Servo",
      version: "latest",
      url: "https://downloads.arduino.cc/libraries/github.com/arduino-libraries/Servo-1.2.1.zip",
    },
  ];

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
  pin: ARDUINO_PINS,
  previousState: ArduinoFrame
): ServoState => {
  const setupCommand = `register::servo::${pin}`;
  const usbCommands = [`write::servo::${pin}::${degree}`];
  if (!previousState) {
    return {
      pins: [pin],
      degree,
      type: ArduinoComponentType.SERVO,
      setupCommand,
      usbCommands,
    };
  }

  const servo = findComponent<ServoState>(
    previousState,
    ArduinoComponentType.SERVO,
    pin
  );

  if (!servo) {
    return {
      pins: [pin],
      degree,
      type: ArduinoComponentType.SERVO,
      setupCommand,
      usbCommands,
    };
  }

  return { ...servo, degree, setupCommand, usbCommands };
};
