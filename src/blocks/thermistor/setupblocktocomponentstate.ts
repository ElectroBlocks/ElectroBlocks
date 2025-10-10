import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { findSensorState } from "../../core/blockly/helpers/sensor_block.helper";
import {
  ArduinoComponentType,
  Timeline,
} from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import type { ThermistorSensor, ThermistorState } from "./state";

export const thermistorSetupBlockToComponentState = (
  block: BlockData,
  timeline: Timeline
): ThermistorState => {
  const sensorData = findSensorState<ThermistorSensor>(block, timeline);

  return {
    type: ArduinoComponentType.THERMISTOR,
    pins: [findFieldValue(block, "PIN") as ARDUINO_PINS],
    temp: sensorData.temp,
    tempC: sensorData.temp,
    tempF: (sensorData.temp * 9) / 5 + 32,
    externalResistorsOhms: +findFieldValue(block, "NONIMAL_RESISTANCE"),
    setupCommand: `register::th::${block.pins[0]}`,
  };
};

export const thermistorStateStringToComponentState = (
  sensorStr: string,
  blocks: BlockData[]
): ThermistorState => {
  const block = blocks.find((b) => b.blockName == "thermistor_setup");
  const pin = findFieldValue(block, "PIN") as ARDUINO_PINS;
  const [_, pinName, celsius] = sensorStr.split(":");
  return {
    type: ArduinoComponentType.THERMISTOR,
    pins: [pin],
    temp: +celsius,
    tempC: +celsius,
    tempF: (+celsius * 9) / 5 + 32,
    externalResistorsOhms: +findFieldValue(block, "NONIMAL_RESISTANCE"),
    setupCommand: `register::th::${block.pins[0]}`,
  };
};