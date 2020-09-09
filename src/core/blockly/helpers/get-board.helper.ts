import Blockly from "blockly";
import is_browser from "../../../helpers/is_browser";
import { debug } from "console";

export const getBoardType = (): string => {
  if (Blockly.getMainWorkspace()) {
    const block = Blockly.getMainWorkspace()
      .getAllBlocks(true)
      .find((b) => b.type === "board_selector");

    return block.getFieldValue("boardtype");
  }

  // Sometimes that block won't be there
  // because of server side rendering
  return "uno";
};
