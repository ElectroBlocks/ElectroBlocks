import Blockly, { Block } from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";
import "../../core/blockly/overrides/custom-color-field.js";

Blockly.Blocks["color_picker_custom"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new (Blockly as any).FieldColorPicker("#ff00ff"),
      "COLOR"
    );
    this.setOutput(true, "Colour");
    this.setColour(COLOR_THEME.VALUES);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
