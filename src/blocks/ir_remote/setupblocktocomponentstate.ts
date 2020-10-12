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

  return {
    type: ArduinoComponentType.IR_REMOTE,
    analogPin: findFieldValue(block, "PIN") as ARDUINO_PINS,
    pins: [findFieldValue(block, "PIN") as ARDUINO_PINS],
    code: irRemoteData.code,
    hasCode: irRemoteData.scanned_new_code,
  };
};
