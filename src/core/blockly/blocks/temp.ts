import Blockly from "blockly";
import { COLOR_THEME } from "../constants/colors";

import { selectBoardBlockly } from "../../microcontroller/selectBoard";
import loopTimes from "./helpers/looptimes";

Blockly.defineBlocksWithJsonArray([
  {
    type: "temp_get_temp",
    message0: "%1 Temperature in Celsius.",
    args0: [
      {
        type: "field_image",
        src: "./blocks/temp/temp.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
    ],
    output: "Number",
    colour: COLOR_THEME.SENSOR,
    tooltip: "",
    helpUrl: "",
  },

  {
    type: "temp_get_humidity",
    message0: "%1 Humidity percentage?",
    args0: [
      {
        type: "field_image",
        src: "./blocks/temp/temp.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
    ],
    output: "Number",
    colour: COLOR_THEME.SENSOR,
    tooltip: "",
    helpUrl: "",
  },
]);

const tempSetupBlock: any = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage("./blocks/temp/temp.png", 15, 15))
      .appendField("Setup Temperature Sensor");
    this.appendDummyInput()
      .appendField("Pin# ")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN"
      );
    this.appendDummyInput("SHOW_CODE_VIEW").appendField(
      "------------------------------------------"
    );
    this.appendDummyInput()
      .appendField("Loop")
      .appendField(
        new Blockly.FieldDropdown(() => {
          return loopTimes();
        }),
        "LOOP"
      );
    this.appendDummyInput()
      .appendField("Temperature Celsius ")
      .appendField(new Blockly.FieldNumber(30, -200, 300, 0.00001), "temp");
    this.appendDummyInput()
      .appendField("Humidity ")
      .appendField(new Blockly.FieldNumber(5, 0, 300), "humidity");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["temp_setup"] = tempSetupBlock;
