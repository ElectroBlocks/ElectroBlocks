import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { findSensorState } from "../../core/blockly/helpers/sensor_block.helper";
import {
  ArduinoComponentType,
  Timeline,
} from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import type {
  DigitalSensor,
  DigitalSensorState,
  DigitalPictureType,
} from "./state";

export const digitalSetupBlockToComponentState = (
  block: BlockData,
  timeline: Timeline
): DigitalSensorState => {
  const digitalSensorState = findSensorState<DigitalSensor>(block, timeline);

  const pin = findFieldValue(block, "PIN") as ARDUINO_PINS;
  return {
    type: ArduinoComponentType.DIGITAL_SENSOR,
    pins: [pin],
    pin,
    setupCommand: `config:dr=${pin}`,
    pictureType: findFieldValue(block, "TYPE") as DigitalPictureType,
    isOn: digitalSensorState.isOn,
  };
};

export const digitalReadSensorStringToComponentState = (
  sensorStr: string,
  blocks: BlockData[]
): DigitalSensorState => {
  const [_, pinStr, state] = sensorStr.split(":");
  const pin = pinStr as ARDUINO_PINS;
  const setupBlock = blocks.find(
    (b) => b.blockName == "digital_read_setup" && b.pins.includes(pin)
  );
  return {
    type: ArduinoComponentType.DIGITAL_SENSOR,
    pins: [pin as ARDUINO_PINS],
    pin: pin as ARDUINO_PINS,
    pictureType: findFieldValue(setupBlock, "TYPE") as DigitalPictureType,
    isOn: state === "1",
  };
};