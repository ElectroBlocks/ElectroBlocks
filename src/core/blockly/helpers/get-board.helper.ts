import Blockly from "blockly";
import { MicroControllerType } from "../../microcontroller/microcontroller";
import { getBlockByType } from "./block.helper";

export const getBoardType = (): MicroControllerType => {
  // This is done for server side rendering and when blockly may
  // not be itiliazed
  const block = getBlockByType("board_selector");

  // Sometimes that block won't be there
  // because of server side rendering
  return block ? block.getFieldValue("boardtype") : "uno";
};
