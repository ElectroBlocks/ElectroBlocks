import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";

Blockly.defineBlocksWithJsonArray([
  // BEGIN JSON EXTRACT
  {
    type: "move_motor",
    message0: "%1 Move  motor %2 Which Motor %3 Direction %4 %5 Speed %6",
    args0: [
      {
        type: "field_image",
        src: "./blocks/motor/motor.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
      {
        type: "input_dummy",
      },
      {
        type: "field_dropdown",
        name: "MOTOR",
        // check: "Number",
        // align: "RIGHT",
        options: [
          ["1", "1"],
          ["2", "2"],
        ],
      },

      {
        type: "field_dropdown",
        name: "DIRECTION",
        options: [
          ["Clockwise", "CLOCKWISE"],
          ["AntiClockwise", "ANTICLOCKWISE"],
        ],
      },
      {
        type: "input_dummy",
        align: "RIGHT",
      },
      {
        type: "input_value",
        name: "SPEED",
        check: "Number",
        align: "RIGHT",
      },
    ],
    inputsInline: false,
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: "",
    helpUrl: "",
  },
]);

const motor_setup = {
  init: function () {
    this.appendDummyInput("")
      .appendField(new Blockly.FieldImage("./blocks/motor/motor.png", 15, 15))
      .appendField("Motor Setup");
    this.appendDummyInput("NAME")
      .appendField("Number of motors")
      .appendField(
        new Blockly.FieldDropdown([
          ["1", "1"],
          ["2", "2"],
        ]),
        "NUMBER_OF_MOTORS"
      );
    this.appendDummyInput("MOTOR_1")
      .appendField("Motor 1 Pins")
      .appendField("EN1")
      .appendField(
        new Blockly.FieldDropdown(selectBoardBlockly().pwmPins),
        "PIN_EN1"
      )
      .appendField("IN2")
      .appendField(
        new Blockly.FieldDropdown(selectBoardBlockly().digitalPins),
        "PIN_IN1"
      )
      .appendField("IN2")
      .appendField(
        new Blockly.FieldDropdown(selectBoardBlockly().digitalPins),
        "PIN_IN2"
      );
    this.appendDummyInput("MOTOR_2")
      .appendField("Motor 2 Pins")
      .appendField("EN2")
      .appendField(
        new Blockly.FieldDropdown(selectBoardBlockly().pwmPins),
        "PIN_EN2"
      )
      .appendField("IN3")
      .appendField(
        new Blockly.FieldDropdown(selectBoardBlockly().digitalPins),
        "PIN_IN3"
      )
      .appendField("IN4")
      .appendField(
        new Blockly.FieldDropdown(selectBoardBlockly().digitalPins),
        "PIN_IN4"
      );
    this.setTooltip("");
    this.setHelpUrl("");
    this.setColour(COLOR_THEME.COMPONENTS);
  },
};
Blockly.common.defineBlocks({ motor_setup: motor_setup });
