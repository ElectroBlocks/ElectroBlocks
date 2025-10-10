import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { findSensorState } from "../../core/blockly/helpers/sensor_block.helper";
import {
  ArduinoComponentType,
  Timeline,
} from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import type { ButtonState, ButtonSensor } from "./state";

export const buttonSetupBlockToComponentState = (
  block: BlockData,
  timeline: Timeline
): ButtonState => {
  const btState = findSensorState<ButtonSensor>(block, timeline);
  const pin = findFieldValue(block, "PIN");
  return {
    type: ArduinoComponentType.BUTTON,
    pins: [pin as ARDUINO_PINS],
    isPressed: btState.is_pressed,
    usePullup: findFieldValue(block, "PULLUP_RESISTOR") === "TRUE",
    setupCommand: `register::bt::${pin}`,
  };
};

export const buttonStringToComponentState = (
  sensorStr: string,
  blocks: BlockData[]
): ButtonState => {
  const [_, pinStr, state] = sensorStr.split(":");
  const pin = pinStr as ARDUINO_PINS;
  const setupBlock = blocks.find(
    (b) => b.blockName == "button_setup" && b.pins.includes(pin)
  );
  return {
    type: ArduinoComponentType.BUTTON,
    pins: [pin as ARDUINO_PINS],
    usePullup: findFieldValue(setupBlock, "PULLUP_RESISTOR") === "TRUE",
    isPressed: state === "1",
  };
};