import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";

Blockly.defineBlocksWithJsonArray([
  // BEGIN JSON EXTRACT
  {
    type: "move_motor",
    message0: "%1 Move motor %2 Which Motor %3 %4 Direction %5 %6 Speed %7",
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
        align: "RIGHT",
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
        type: "input_dummy",
        align: "RIGHT",
        name: "WHICH_MOTOR",
      },
      {
        type: "field_dropdown",
        name: "DIRECTION",
        options: [
          ["Clockwise", "CLOCKWISE"],
          ["AntiClockwise", "ANTI_CLOCKWISE"],
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
  {
    type: "stop_motor",
    tooltip: "",
    helpUrl: "",
    message0: "%1 Stop Motor %2 Which Motor %3 %4",
    args0: [
      {
        type: "field_image",
        src: "./blocks/motor/motor.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: "FALSE",
      },
      {
        type: "input_dummy",
        name: "Title",
        align: "RIGHT",
      },
      {
        type: "field_dropdown",
        name: "MOTOR",
        options: [
          ["1", "1"],
          ["2", "2"],
        ],
      },
      {
        type: "input_dummy",
        name: "WHICH_MOTOR",
        align: "RIGHT",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
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
        "NUMBER_OF_COMPONENTS"
      );
    this.appendDummyInput("COMPONENT_1")
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
    this.appendDummyInput("COMPONENT_2")
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
