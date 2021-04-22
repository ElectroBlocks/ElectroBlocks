import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";

Blockly.Blocks["rgb_led_setup"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage("./blocks/led/color_led.png", 15, 15))
      .appendField("Setup RGB LED");
    this.appendDummyInput()
      .appendField("Picture Type")
      .appendField(
        new Blockly.FieldDropdown([
          ["Breadboard", "BREADBOARD"],
          ["Built in resistors", "BUILT_IN"],
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
  {
    type: "set_color_led",
    message0: "%1 Set RGB LED's Color %2",
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
