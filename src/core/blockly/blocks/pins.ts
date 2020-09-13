import { selectBoardBlockly } from "../../microcontroller/selectBoard";
import Blockly from "blockly";

import { COLOR_THEME } from "../constants/colors";
import loopTimes from "./helpers/looptimes";
import {
  configuredPins,
  getAvailablePins,
} from "./helpers/getAvialablePinsFromSetupBlock";

Blockly.defineBlocksWithJsonArray([
  {
    type: "analog_read",
    message0: "%1 Read number from analog pin# %2",
    args0: [
      {
        type: "field_image",
        src: "./blocks/arduino/analog_read.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
      {
        type: "field_dropdown",
        name: "PIN",
        options: selectBoardBlockly().analogPins,
      },
    ],
    output: "Number",
    colour: COLOR_THEME.SENSOR,
    tooltip: "",
    helpUrl: "",
  },
]);

Blockly.Blocks["analog_write"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage(
          "https://www.gstatic.com/codesite/ph/images/star_on.gif",
          15,
          15
        )
      )
      .appendField("Send analog wave to pin ")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().pwmPins),
        "PIN"
      );
    this.appendValueInput("WRITE_VALUE")
      .setCheck("Number")
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField("Wave Intensity");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["digital_write"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/arduino/digital_write.png", 15, 15)
      )
      .appendField("Turn ")
      .appendField(
        new Blockly.FieldDropdown([
          ["on", "ON"],
          ["off", "OFF"],
        ]),
        "STATE"
      )
      .appendField("pin# ")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().digitalPins),
        "PIN"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

const analogReadBlock: any = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/arduino/analog_read.png", 15, 15)
      )
      .appendField("Read number from analog pin#")
      .appendField(
        new Blockly.FieldDropdown(() => {
          return configuredPins(
            "digital_read_setup",
            selectBoardBlockly().analogPins
          );
        }),
        "PIN"
      );

    this.setOutput(true, "Number");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["analog_read"] = analogReadBlock;

const digitalReadBlock: any = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/arduino/digital_read.png", 15, 15)
      )
      .appendField("Is electricity running through pin#")
      .appendField(
        new Blockly.FieldDropdown(() => {
          return configuredPins(
            "digital_read_setup",
            selectBoardBlockly().digitalPins
          );
        }),
        "PIN"
      );

    this.setOutput(true, "Boolean");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["digital_read"] = digitalReadBlock;

const digitalReadSetupBlock: any = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/arduino/digital_read.png", 15, 15)
      )
      .appendField("Setup Digital Read Pin");
    this.appendDummyInput()
      .appendField("PIN #")
      .appendField(
        new Blockly.FieldDropdown(() => {
          return getAvailablePins(
            "digital_read_setup",
            this.getFieldValue("PIN"),
            selectBoardBlockly().digitalPins
          );
        }),
        "PIN"
      );

    this.appendDummyInput("SHOW_CODE_VIEW")
      .appendField("Type")
      .appendField(
        new Blockly.FieldDropdown([
          ["Touch Sensor", "TOUCH_SENSOR"],
          ["Sensor", "SENSOR"],
        ]),
        "TYPE"
      );
    this.appendDummyInput("SHOW_CODE_VIEW").appendField(
      "------------------------------------"
    );
    this.appendDummyInput("LOOP_TIMES")
      .appendField("Loop")
      .appendField(
        new Blockly.FieldDropdown(() => {
          return loopTimes();
        }),
        "LOOP"
      );
    this.appendDummyInput()
      .appendField("Has Power? ")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "state");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["digital_read_setup"] = digitalReadSetupBlock;

const analogReadSetupBlock: any = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/arduino/analog_read.png", 15, 15)
      )
      .appendField("Analog Read Setup");
    this.appendDummyInput()
      .appendField("PIN #")
      .appendField(
        new Blockly.FieldDropdown(() => {
          return getAvailablePins(
            "analog_read_setup",
            this.getFieldValue("PIN"),
            selectBoardBlockly().analogPins
          );
        }),
        "PIN"
      );
    this.appendDummyInput("SHOW_CODE_VIEW")
      .appendField("Type")
      .appendField(
        new Blockly.FieldDropdown([
          ["Photo Sensor", "PHOTO_SENSOR"],
          ["Soil Sensor", "SOIL_SENSOR"],
          ["Sensor", "SENSOR"],
        ]),
        "TYPE"
      );
    this.appendDummyInput("SHOW_CODE_VIEW").appendField(
      "------------------------------------"
    );
    this.appendDummyInput("LOOP_TIMES")
      .appendField("Loop")
      .appendField(
        new Blockly.FieldDropdown(() => {
          return loopTimes();
        }),
        "LOOP"
      );

    this.appendDummyInput()
      .appendField("Power Level")
      .appendField(new Blockly.FieldNumber(1, 0, 1024, 0.000001), "state");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["analog_read_setup"] = analogReadSetupBlock;
