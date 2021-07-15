import Blockly from "blockly";
import {
  configuredPins,
  getAvailablePins,
} from "../../core/blockly/helpers/getAvialablePinsFromSetupBlock";
import loopTimes from "../../core/blockly/helpers/looptimes";
import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";

const digitalReadBlock: any = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/arduino/digital_read.png", 15, 15)
      )
      .appendField("digital sensor ")
      .appendField(
        new Blockly.FieldDropdown(() => {
          return configuredPins(
            "digital_read_setup",
            selectBoardBlockly().digitalPins
          );
        }),
        "PIN"
      )
      .appendField(" deteched something?");
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
      .appendField("Sensing something? ")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "isOn");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["digital_read_setup"] = digitalReadSetupBlock;
