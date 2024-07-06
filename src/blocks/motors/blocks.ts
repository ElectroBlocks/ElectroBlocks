import Blockly from "blockly";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

Blockly.defineBlocksWithJsonArray([
  {
    type: "move_motor",
    message0: "%1 Move motor %2 Direction %3 %4 Speed %5",
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
  {
    type: "setup_motor",
    message0: "%1 Setup Motor %2 Which Motor %3 EN1 %4 EN2 ",
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
        options: [
          ["1", "1"],
          ["2", "2"],
        ],
      },
      {
        type: "field_dropdown",
        name: "PIN_1",
        options: [
          ["3", "3"],
          ["5", "5"],
          ["6", "6"],
          ["9", "9"],
          ["10", "10"],
          ["11", "11"],
        ],
      },
      // {
      //   type: "input_dummy",
      //   align: "RIGHT",
      // },
      {
        type: "field_dropdown",
        name: "PIN_2",
        options: [
          ["3", "3"],
          ["5", "5"],
          ["6", "6"],
          ["9", "9"],
          ["10", "10"],
          ["11", "11"],
        ],
      },
      // {
      //   type: "input_dummy",
      //   align: "RIGHT",
      // },
      
    ],
    inputsInline: false,
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: "",
    helpUrl: "",
  },
]);

// Blockly.Blocks["motor_setup"] = {
//   init: function () {
//     this.appendDummyInput()
//       .appendField(new Blockly.FieldImage("./blocks/motor/motor.png", 15, 15))
//       .appendField("Setup Motor");
//     this.appendDummyInput()
//       .appendField("Library")
//       .appendField(
//         new Blockly.FieldDropdown([
//           ["L298N", "L298N"],
//         ]),
//         "LIBRARY"
//       );
//     this.appendDummyInput()
//       .appendField("EN1")
//       .appendField(
//         new Blockly.FieldDropdown(() => selectBoardBlockly().pwmPins),
//         "EN1"
//       )
//       .appendField("EN2")
//       .appendField(
//         new Blockly.FieldDropdown(() => selectBoardBlockly().pwmPins),
//         "EN2"
//       );
//     this.appendDummyInput()
//       .appendField("Motor Pin 1")
//       .appendField(
//         new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
//         "PIN_1"
//       )
//       .appendField("Motor Pin 2")
//       .appendField(
//         new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
//         "PIN_2"
//       );
//     this.setColour(COLOR_THEME.COMPONENTS);
//     this.setTooltip("");
//     this.setHelpUrl("");
//   },
// };
