import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import type { ThermistorSensor } from "./state";

export const thermistorSetupBlockToSensorData = (
  block: BlockData
): ThermistorSensor => {
  return {
    temp: +findFieldValue(block, "TEMP"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};
