import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";
import loopTimes from "../../core/blockly/helpers/looptimes";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";

Blockly.Blocks["joystick_setup"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/joystick/joystick.png", 15, 15)
      )
      .appendField("JoyStick Setup");
    this.appendDummyInput()
      .appendField("X Pin: ")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().analogPins),
        "PIN_X"
      );
    this.appendDummyInput()
      .appendField("Y Pin: ")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().analogPins),
        "PIN_Y"
      );
    this.appendDummyInput()
      .appendField("Button Pin: ")
      .appendField(
        new Blockly.FieldDropdown(selectBoardBlockly().digitalPins),
        "PIN_BUTTON"
      );
    this.appendDummyInput().appendField("------------------------------");
    this.appendDummyInput()
      .appendField("Loop")
      .appendField(new Blockly.FieldDropdown(() => loopTimes()), "LOOP");
    this.appendDummyInput()
      .appendField("Engaged")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "ENGAGED");
    this.appendDummyInput()
      .appendField("Degree")
      .appendField(new Blockly.FieldAngle(0), "DEGREE");
    this.appendDummyInput()
      .appendField("Button Pressed")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "BUTTON_PRESSED");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["joystick_angle"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/joystick/joystick.png", 15, 15)
      )
      .appendField("Joystick Angle");
    this.setOutput(true, "Number");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["joystick_engaged"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/joystick/joystick.png", 15, 15)
      )
      .appendField("joystick is engaged?");
    this.setOutput(true, "Boolean");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["joystick_button"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/joystick/joystick.png", 15, 15)
      )
      .appendField(" joystick button is pressed?");
    this.setOutput(true, "Boolean");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
