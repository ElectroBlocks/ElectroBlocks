import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { findSensorState } from "../../core/blockly/helpers/sensor_block.helper";
import {
  ArduinoComponentType,
  Timeline,
} from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import {
  DigitalSensor,
  DigitalSensorState,
  DigitalSensorType,
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
    setupCommand: `register::dr::${pin}`,
    sensorType: findFieldValue(block, "TYPE") as DigitalSensorType,
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
  const sensorType = findFieldValue(setupBlock, "TYPE") as DigitalSensorType;
  const isOn = sensorType == DigitalSensorType.IR_SENSOR ? state == "0" : state == "1";

  return {
    type: ArduinoComponentType.DIGITAL_SENSOR,
    pins: [pin as ARDUINO_PINS],
    pin: pin as ARDUINO_PINS,
    sensorType: findFieldValue(setupBlock, "TYPE") as DigitalSensorType,
    isOn
  };
};