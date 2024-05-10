import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";
import ColorWheelField from "blockly-field-color-wheel";

Blockly.Blocks["color_picker_custom"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new ColorWheelField("#ff00ff"),
      "COLOR"
    );
    this.setOutput(true, "Colour");
    this.setColour(COLOR_THEME.VALUES);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
