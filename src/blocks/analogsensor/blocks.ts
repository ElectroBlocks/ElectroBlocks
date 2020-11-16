import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";
import Blockly from "blockly";

import { COLOR_THEME } from "../../core/blockly/constants/colors";
import loopTimes from "../../core/blockly/helpers/looptimes";
import {
  configuredPins,
  getAvailablePins,
} from "../../core/blockly/helpers/getAvialablePinsFromSetupBlock";
import { virtualCircuitComment, whatIsAPin } from "../comment-text";


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

    this.setCommentText(
      `This block (analog read) senses the amount of electricity flowing through a pin.${whatIsAPin}`
    );
    this.comment.setBubbleSize(553, 140);

  },
};

Blockly.Blocks["analog_read"] = analogReadBlock;

const analogReadSetupBlock: any = {
  init: function () {

  this.setCommentText(
    `This block (analog read setup) tells the Arduino which pin is sense electricity.${whatIsAPin}${virtualCircuitComment}`
  );
  this.comment.setBubbleSize(553, 171);

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
