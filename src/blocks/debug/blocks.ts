import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

Blockly.Blocks["debug_block"] = {
  init: function () {
    this.appendDummyInput().appendField("Debug");
    this.appendDummyInput().appendField(
      new Blockly.FieldImage("./blocks/debug/debug.png", 70, 50)
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.ARDUINO);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
