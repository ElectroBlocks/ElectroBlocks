import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";
import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

Blockly.Blocks["digital_display_setup"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage(
          "/blocks/digit4display/digit4display.png",
          20,
          20
        )
      )
      .appendField("Digital Display");
    this.appendDummyInput()
      .appendField("Type ")
      .appendField(
        new Blockly.FieldDropdown([
          ["MULTIPLE", "MULTIPLE"],
          ["SINGLE", "SINGLE"],
        ]),
        "COMPONENT_TYPE"
      );
    this.appendDummyInput()
      .appendField("DIO Pin# ")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "DIO_PIN"
      )
      .appendField("CLK Pin# ")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "CLK_PIN"
      );
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["digital_display_set"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage(
          "/blocks/digit4display/digit4display.png",
          20,
          20
        )
      )
      .appendField("Set Digital Display");
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Colon: ")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "COLON");

    this.appendValueInput("TEXT")
      .setCheck(null)
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Text");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
