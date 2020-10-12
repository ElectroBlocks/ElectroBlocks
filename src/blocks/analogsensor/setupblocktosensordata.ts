import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import type { AnalogSensor } from "./state";

export const analogSetupBlockToSensorData = (
  block: BlockData
): AnalogSensor => {
  return {
    state: +findFieldValue(block, "state"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};
