import type { BlockData } from "../../core/blockly/dto/block.type";
import { findSensorState } from "../../core/blockly/helpers/sensor_block.helper";
import {
  ArduinoComponentType,
  Timeline,
} from "../../core/frames/arduino.frame";
import type {
  ArduinoReceiveMessageState,
  ArduinoRecieveMessageSensor,
} from "./state";

export const messageSetupBlockToComponentState = (
  block: BlockData,
  timeline: Timeline
): ArduinoReceiveMessageState => {
  const btState = findSensorState<ArduinoRecieveMessageSensor>(block, timeline);

  return {
    type: ArduinoComponentType.MESSAGE,
    pins: [],
    hasMessage: btState?.receiving_message || false,
    message: btState?.message || "",
  };
};
