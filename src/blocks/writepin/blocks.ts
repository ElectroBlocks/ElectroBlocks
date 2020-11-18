import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";
import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { whatIsAPin } from "../comment-text";

Blockly.Blocks["analog_write"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/arduino/analog_write.png", 15, 15)
      )
      .appendField("Send analog wave to pin ")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().pwmPins),
        "PIN"
      );
    this.appendValueInput("WRITE_VALUE")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Wave Intensity");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");

    this.setCommentText(
      `This block (analog write) sends a number from 0 to 255 to a pin.\n255 means that pins is completely on while 0 means the pin is off.${whatIsAPin}`
    );
    this.comment.setBubbleSize(460, 120);

  },
};

Blockly.Blocks["digital_write"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/arduino/digital_write.png", 15, 15)
      )
      .appendField("Turn ")
      .appendField(
        new Blockly.FieldDropdown([
          ["on", "ON"],
          ["off", "OFF"],
        ]),
        "STATE"
      )
      .appendField("pin# ")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      `This block (digital write) turns on and off a pin.${whatIsAPin}`
    );
    this.comment.setBubbleSize(460, 150);

  },
};
