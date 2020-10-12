import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import type { ButtonSensor } from "./state";

export const buttonSetupBlockToSensorData = (
  block: BlockData
): ButtonSensor => {
  return {
    is_pressed: findFieldValue(block, "is_pressed") === "TRUE",
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};
