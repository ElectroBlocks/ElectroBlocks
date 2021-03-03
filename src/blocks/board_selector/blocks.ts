import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

Blockly.Blocks["board_selector"] = {
  init: function () {
    this.appendDummyInput().appendField("Select Board");
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["Arduino Uno", "uno"],
        ["Arduino Mega", "mega"],
      ]),
      "boardtype"
    );
    this.setColour(COLOR_THEME.ARDUINO_START_BLOCK);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText("Tells Arduino simulator type of Arduino use.");
    if (typeof this.comment !== "string") {
      this.comment.setBubbleSize(460, 70);
    }
  },
};
