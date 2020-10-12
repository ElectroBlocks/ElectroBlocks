import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import type { ArduinoRecieveMessageSensor } from "./state";

export const messageSetupBlockToSensorData = (
  block: BlockData
): ArduinoRecieveMessageSensor => {
  return {
    receiving_message: findFieldValue(block, "receiving_message") === "TRUE",
    message: findFieldValue(block, "message"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};
