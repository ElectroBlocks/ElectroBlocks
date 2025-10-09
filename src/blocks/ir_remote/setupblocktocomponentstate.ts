import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import { findSensorState } from "../../core/blockly/helpers/sensor_block.helper";
import {
  ArduinoComponentType,
  Timeline,
} from "../../core/frames/arduino.frame";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import type { IRRemoteSensor, IRRemoteState } from "./state";

export const irRemoteSetupBlockToComponentState = (
  block: BlockData,
  timeline: Timeline
): IRRemoteState => {
  const irRemoteData = findSensorState<IRRemoteSensor>(block, timeline);
  const pin = findFieldValue(block, "PIN") as ARDUINO_PINS;
  return {
    type: ArduinoComponentType.IR_REMOTE,
    pin: pin,
    pins: [pin],
    code: irRemoteData.code,
    hasCode: irRemoteData.scanned_new_code,
    setupCommand: `register::ir::${pin}`,
    importLibraries: [
      {
        name: "IRremote",
        url: "https://downloads.arduino.cc/libraries/github.com/z3t0/IRremote-4.2.1.zip",
        version: "latest",
      },
    ],
  };
};

export const irRemoteStateStringToComponentState = (
  sensorStr: string,
  blocks: BlockData[]
): IRRemoteState => {
  const setupBlock = blocks.find((b) => b.blockName == "ir_remote_setup");
  const [_, pinState, state] = sensorStr.split(":");
  const pin = findFieldValue(setupBlock, "PIN");
  return {
    type: ArduinoComponentType.IR_REMOTE,
    pins: [pin],
    pin: pin,
    hasCode: state.length > 0,
    code: state,
    setupCommand: `register::ir::${pin}`,
    importLibraries: [
      {
        name: "IRremote",
        url: "https://downloads.arduino.cc/libraries/github.com/z3t0/IRremote-4.2.1.zip",
        version: "latest",
      },
    ],
  };
};