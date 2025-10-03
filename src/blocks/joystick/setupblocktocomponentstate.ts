import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { findSensorState } from "../../core/blockly/helpers/sensor_block.helper";
import {
  ArduinoComponentType,
  Timeline,
} from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { joystickSetup } from "./blocktoframe";
import type { JoystickState, JoyStickSensor } from "./state";

export const joystickSetupBlockToComponentState = (
  block: BlockData,
  timeline: Timeline
): JoystickState => {
  const xPin = findFieldValue(block, "PIN_X") as ARDUINO_PINS;
  const yPin = findFieldValue(block, "PIN_Y") as ARDUINO_PINS;
  const buttonPin = findFieldValue(block, "PIN_BUTTON") as ARDUINO_PINS;
  const joyStickSensor = findSensorState<JoyStickSensor>(block, timeline);

  const joystickState: JoystickState = {
    type: ArduinoComponentType.JOYSTICK,
    pins: [xPin, yPin, buttonPin],
    buttonPin,
    xPin,
    yPin,
    buttonPressed: joyStickSensor.buttonPressed,
    engaged: joyStickSensor.engaged,
    degree: joyStickSensor.degree,
    setupCommand: `register::js::${xPin}::${yPin}::${buttonPin}`,
  };

  return joystickState;
};

export const joyStickStringToState = (
  sensorStr: string,
  blocks: BlockData[]
): JoystickState => {
  const block = blocks.find((b) => b.blockName == "joystick_setup");
  const xPin = findFieldValue(block, "PIN_X") as ARDUINO_PINS;
  const yPin = findFieldValue(block, "PIN_Y") as ARDUINO_PINS;
  const buttonPin = findFieldValue(block, "PIN_BUTTON") as ARDUINO_PINS;
  const [_, pinState, buttonPressedText, degreeText, engagedText] =
    sensorStr.split(":");
  return {
    type: ArduinoComponentType.JOYSTICK,
    pins: [xPin, yPin, buttonPin],
    buttonPin,
    xPin,
    yPin,
    buttonPressed: buttonPressedText == "1",
    engaged: engagedText == "1",
    degree: +degreeText,
    setupCommand: `register::js::${xPin}::${yPin}::${buttonPin}`,
  };
};

