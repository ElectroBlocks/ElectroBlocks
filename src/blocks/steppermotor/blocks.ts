import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";
import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

Blockly.Blocks["stepper_motor_setup"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/steppermotor/steppermotor.png", 15, 15)
      )
      .appendField("Stepper Motor Setup");
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("PIN 1")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN_1"
      )
      .appendField("PIN 2")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN_2"
      )
      .appendField("PIN 3")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN_3"
      )
      .appendField("PIN 4")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN_4"
      );
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Speed")
      .appendField(new Blockly.FieldNumber(30, 0, 1000), "SPEED");

    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Total Steps")
      .appendField(new Blockly.FieldNumber(200, 0, 500), "TOTAL_STEPS");

    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["stepper_motor_move"] = {
  init: function () {
    this.appendValueInput("STEPS")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(
        new Blockly.FieldImage("./blocks/steppermotor/steppermotor.png", 15, 15)
      )
      .appendField("Stepper Motor move");
    this.appendDummyInput().appendField("steps.");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
