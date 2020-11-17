import Blockly from "blockly";
import {
  configuredPins,
  getAvailablePins,
} from "../../core/blockly/helpers/getAvialablePinsFromSetupBlock";
import loopTimes from "../../core/blockly/helpers/looptimes";
import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";
import { virtualCircuitComment, whatIsAPin } from "../comment-text";

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
    this.setCommentText("Returns true if the sensor is sensing something.");
    this.comment.setBubbleSize(553, 70);

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
      .appendField(new Blockly.FieldCheckbox("TRUE"), "isOn");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      `This block (analog read setup) tells the Arduino which pin is sense electricity.${whatIsAPin}${virtualCircuitComment}`
    );
    this.comment.setBubbleSize(553, 171);

  },
};

Blockly.Blocks["digital_read_setup"] = digitalReadSetupBlock;
