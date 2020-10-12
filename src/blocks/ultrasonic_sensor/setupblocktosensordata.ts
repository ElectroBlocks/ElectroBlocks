import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import type { UltraSonicSensor } from "./state";

export const ultraSonicSetupBlockToSensorData = (
  block: BlockData
): UltraSonicSensor => {
  return {
    cm: +findFieldValue(block, "cm"),
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};
