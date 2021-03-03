import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

Blockly.Blocks["arduino_loop"] = {
  init: function () {
    this.appendDummyInput().appendField("Loop (runs forever)");
    this.appendDummyInput()
      .appendField("Loop (runs ")
      .appendField(new Blockly.FieldNumber(3, 0, 1000), "LOOP_TIMES")
      .appendField("times)");
    this.appendStatementInput("loop").setCheck(null);
    this.setColour(COLOR_THEME.ARDUINO_START_BLOCK);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      "The loop block runs on repeat until your Arduino loses power.  It runs right after your setup block if you have one.\n\nIf you are using the simulator, you can control how many times it repeats."
    );
    if (typeof this.comment !== "string") {
      this.comment.setBubbleSize(460, 170);
    }
  },
};

Blockly.Blocks["arduino_setup"] = {
  init: function () {
    this.appendDummyInput().appendField("Setup (runs once)");
    this.appendStatementInput("setup").setCheck(null);
    this.setColour(COLOR_THEME.ARDUINO_START_BLOCK);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      "The setup block runs after all library blocks.  It only runs once.\n\nUse a setup block initialize variables in code."
    );
    if (typeof this.comment !== "string") {
      this.comment.setBubbleSize(460, 150);
    }
  },
};
