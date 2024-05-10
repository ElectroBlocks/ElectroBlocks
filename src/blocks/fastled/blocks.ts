import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";
import ColorWheelField from "blockly-field-color-wheel";

import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";

Blockly.defineBlocksWithJsonArray([
  {
    type: "fastled_set_color",
    message0: "%1 Set Led Color %2 Which Led? %3 What Color? %4",
    args0: [
      {
        type: "field_image",
        src: "./blocks/neo_pixel/neo_pixel.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "POSITION",
        check: "Number",
        align: "RIGHT",
      },
      {
        type: "input_value",
        name: "COLOR",
        check: "Colour",
        align: "RIGHT",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "fastled_show_all_colors",
    message0: "%1 show all rgb leds",
    args0: [
      {
        type: "field_image",
        src: "./blocks/neo_pixel/neo_pixel.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.COMPONENTS,
    tooltip: "",
    helpUrl: "",
  },
]);

Blockly.Blocks["fastled_setup"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/neo_pixel/neo_pixel.png", 15, 15)
      )
      .appendField("Setup Led Color Strip");
    this.appendDummyInput()
      .appendField("Analog Data Pin")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().pwmPins),
        "PIN"
      );
    this.appendDummyInput()
      .appendField("Type")
      .appendField(
        new Blockly.FieldDropdown([
          ["WS2811", "WS2811"],
          ["WS2801", "WS2801"],
          ["WS2803", "WS2803"],
          ["APA102", "APA102"],
          ["APA104", "APA104"],
          ["APA106", "APA106"],
          ["DOTSTAR", "DOTSTAR"],
          ["GE8822", "GE8822"],
          ["GS1903", "GS1903"],
          ["GW6205", "GW6205"],
          ["GW6205_400", "GW6205_400"],
          ["LPD1886", "LPD1886"],
          ["LPD1886_8BIT", "LPD1886_8BIT"],
          ["LPD6803", "LPD6803"],
          ["LPD8806", "LPD8806"],
          ["P9813", "P9813"],
          ["PL9823", "PL9823"],
          ["SK6812", "SK6812"],
          ["SK6822", "SK6822"],
          ["SK9822", "SK9822"],
          ["SM16703", "SM16703"],
          ["SM16716", "SM16716"],
          ["TM1803", "TM1803"],
          ["TM1804", "TM1804"],
          ["TM1809", "TM1809"],
          ["TM1812", "TM1812"],
          ["TM1829", "TM1829"],
          ["UCS1903", "UCS1903"],
          ["UCS1903B", "UCS1903B"],
          ["UCS1904", "UCS1904"],
          ["UCS2903", "UCS2903"],
          ["WS2811_400", "WS2811_400"],
          ["WS2812", "WS2812"],
          ["WS2812B", "WS2812B"],
          ["WS2813", "WS2813"],
          ["WS2852", "WS2852"],
        ]),
        "CHIP_SET"
      );

    this.appendDummyInput()
      .appendField("Color Order")
      .appendField(
        new Blockly.FieldDropdown([
          ["RGB", "RGB"],
          ["GRB", "GRB"],
          ["RBG", "RBG"],
          ["GBR", "GBR"],
          ["BRG", "BRG"],
          ["BGR", "BGR"],
        ]),
        "COLOR_ORDER"
      );

    this.appendDummyInput()
      .appendField("Number of leds")
      .appendField(new Blockly.FieldNumber(30, 1, 150), "NUMBER_LEDS");
    this.appendDummyInput()
      .appendField("Brightness 1 to 255")
      .appendField(new Blockly.FieldNumber(10, 1, 255, 1), "BRIGHTNESS");

    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["fastled_set_all_colors"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/neo_pixel/neo_pixel.png", 15, 15)
      )
      .appendField("Set all Colors");
    // This is so that it starts the bottom.
    for (let rows = 12; rows >= 1; rows -= 1) {
      let input = this.appendDummyInput();
      for (let cols = 1; cols <= 12; cols += 1) {
        // This is to reverse the columns
        let actualCol = rows % 2 == 0 ? 13 - cols : cols;
        input.appendField(
          new ColorWheelField("#000000"),
          `${rows}-${actualCol}`
        );
      }
    }
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
