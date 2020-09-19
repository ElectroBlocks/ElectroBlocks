import Blockly from "blockly";
import { COLOR_THEME } from "../constants/colors";
import { selectBoardBlockly } from "../../microcontroller/selectBoard";

Blockly.Blocks["led"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage("./blocks/led/led.png", 15, 15))
      .appendField("Turn led#")
      .appendField(
        new Blockly.FieldDropdown(() => {
          return selectBoardBlockly().digitalPins;
        }),
        "PIN"
      )
      .appendField(
        new Blockly.FieldDropdown([
          ["on", "ON"],
          ["off", "OFF"],
        ]),
        "STATE"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["led_fade"] = {
  init: function () {
    this.appendValueInput("FADE")
      .setCheck("Number")
      .appendField(new Blockly.FieldImage("./blocks/led/led.png", 15, 15))
      .appendField("Fade led#")
      .appendField(
        new Blockly.FieldDropdown(() => {
          return selectBoardBlockly().pwmPins;
        }),
        "PIN"
      )
      .appendField("to ");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["led_color_setup"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage("./blocks/led/color_led.png", 15, 15))
      .appendField("Color Led Setup");
    this.appendDummyInput()
      .appendField("Picture Type")
      .appendField(
        new Blockly.FieldDropdown([
          ["Breadboard", "BREADBOARD"],
          ["Built In", "BUILT_IN"],
        ]),
        "PICTURE_TYPE"
      );
    this.appendDummyInput()
      .appendField("Red")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().pwmPins),
        "PIN_RED"
      )
      .appendField("Green")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().pwmPins),
        "PIN_GREEN"
      )
      .appendField("Blue")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().pwmPins),
        "PIN_BLUE"
      );
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.defineBlocksWithJsonArray([
  // {
  //   type: "led_color_setup",
  //   lastDummyAlign0: "RIGHT",
  //   message0:
  //     "%1 Color Led Setup %2 Picture Type:  %3 %4 Red Green Blue Wires:  %5",
  //   args0: [
  //     {
  //       type: "field_image",
  //       src: "./blocks/led/color_led.png",
  //       width: 15,
  //       height: 15,
  //       alt: "*",
  //       flipRtl: false,
  //     },
  //     {
  //       type: "input_dummy",
  //     },
  //     {
  //       type: "field_dropdown",
  //       name: "PICTURE_TYPE",
  //       options: [
  //         ["Breadboard", "BREADBOARD"],
  //         ["Built In", "BUILT_IN"],
  //       ],
  //     },
  //     {
  //       type: "input_dummy",
  //       align: "RIGHT",
  //     },
  //     {
  //       type: "field_dropdown",
  //       name: "WIRE",
  //       options: [
  //         ["6 - 5 - 3", "6-5-3"],
  //         ["11 - 10 - 9", "11-10-9"],
  //       ],
  //     },
  //   ],
  //   colour: COLOR_THEME.COMPONENTS,
  //   tooltip: "",
  //   helpUrl: "",
  // },
  {
    type: "set_color_led",
    message0: "%1 Set Color Led's Color %2",
    args0: [
      {
        type: "field_image",
        src: "./blocks/led/color_led.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
      {
        type: "input_value",
        name: "COLOUR",
        check: "Colour",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: "",
    helpUrl: "",
  },
]);
