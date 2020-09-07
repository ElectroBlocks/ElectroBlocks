import Blockly from "blockly";
import { COLOR_THEME } from "../constants/colors";
import { selectBoardBlockly } from "../../microcontroller/selectBoard";

Blockly.defineBlocksWithJsonArray([
  {
    type: "led",
    message0: "%1 Turn  %2 led  %3",
    args0: [
      {
        type: "field_image",
        src: "./blocks/led/led.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
      {
        type: "field_dropdown",
        name: "STATE",
        options: [
          ["on", "ON"],
          ["off", "OFF"],
        ],
      },
      {
        type: "field_dropdown",
        name: "PIN",
        options: selectBoardBlockly().digitalPins,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "led_fade",
    message0: "%1 Fade Led# %2 to  %3",
    args0: [
      {
        type: "field_image",
        src: "./blocks/led/led.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
      {
        type: "field_dropdown",
        name: "PIN",
        options: selectBoardBlockly().pwmPins,
      },
      {
        type: "input_value",
        name: "FADE",
        check: "Number",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "led_color_setup",
    lastDummyAlign0: "RIGHT",
    message0:
      "%1 Color Led Setup %2 Picture Type:  %3 %4 Red Green Blue Wires:  %5",
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
        type: "input_dummy",
      },
      {
        type: "field_dropdown",
        name: "PICTURE_TYPE",
        options: [
          ["Breadboard", "BREADBOARD"],
          ["Built In", "BUILT_IN"],
        ],
      },
      {
        type: "input_dummy",
        align: "RIGHT",
      },
      {
        type: "field_dropdown",
        name: "WIRE",
        options: [
          ["6 - 5 - 3", "6-5-3"],
          ["11 - 10 - 9", "11-10-9"],
        ],
      },
    ],
    colour: COLOR_THEME.COMPONENTS,
    tooltip: "",
    helpUrl: "",
  },
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
