import Blockly from "blockly";

Blockly.Blocks["color_picker_custom"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new (Blockly as any).FieldColorPicker("#ff00ff"),
      "COLOR"
    );
    this.setOutput(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
