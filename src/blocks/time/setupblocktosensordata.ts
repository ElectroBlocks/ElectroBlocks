import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import type { TimeSensor } from "./state";

export const timeSetupBlockToSensorData = (block: BlockData): TimeSensor => {
  return {
    time_in_seconds: +findFieldValue(block, "time_in_seconds"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};
