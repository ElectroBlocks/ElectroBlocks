import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helper";
import type { JoyStickSensor } from "./state";

export const joyStickSetupBlocktoSensorData = (
  block: BlockData
): JoyStickSensor => {
  return {
    buttonPressed: findFieldValue(block, "BUTTON_PRESSED") === "TRUE",
    degree: +findFieldValue(block, "DEGREE"),
    engaged: findFieldValue(block, "ENGAGED") === "TRUE",
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};
