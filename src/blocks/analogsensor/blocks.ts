import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";
import Blockly from "blockly";

import { COLOR_THEME } from "../../core/blockly/constants/colors";
import loopTimes from "../../core/blockly/blocks/helpers/looptimes";
import {
  configuredPins,
  getAvailablePins,
} from "../../core/blockly/blocks/helpers/getAvialablePinsFromSetupBlock";

Blockly.Blocks["analog_write"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/arduino/analog_write.png", 15, 15)
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
