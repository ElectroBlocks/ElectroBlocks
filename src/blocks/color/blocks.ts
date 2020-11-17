import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

Blockly.Blocks["colour_rgb"] = {
  init: function () {
    this.appendDummyInput().appendField("Color with");
    this.appendValueInput("RED")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Red");
    this.appendValueInput("GREEN")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Green");
    this.appendValueInput("BLUE")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Blue");
    this.setOutput(true, null);
    this.setColour(COLOR_THEME.VALUES);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      `This is used to create a custom color.  Google "RGB color picker" to find a custom color.`
    );
    this.comment.setBubbleSize(553, 70);
  },
};
