import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

import loopTimes from "../../core/blockly/helpers/looptimes";
Blockly.defineBlocksWithJsonArray([
  {
    type: "arduino_receive_message",
    message0: "%1 Arduino received a message? ",
    args0: [
      {
        type: "field_image",
        src: "./blocks/message/message.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
    ],
    output: "Boolean",
    colour: COLOR_THEME.ARDUINO,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "arduino_get_message",
    message0: "%1 Arduino get message",
    args0: [
      {
        type: "field_image",
        src: "./blocks/message/message.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
    ],
    output: "String",
    colour: COLOR_THEME.ARDUINO,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "arduino_send_message",
    message0: "%1 Arduino send message %2",
    args0: [
      {
        type: "field_image",
        src: "./blocks/message/message.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
      {
        type: "input_value",
        name: "MESSAGE",
        check: "String",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: COLOR_THEME.ARDUINO,
    tooltip: "",
    helpUrl: "",
  },
]);

const messageSetupBlock: any = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/message/message.png", 15, 15)
      )
      .appendField("Message Setup");

    this.appendDummyInput("SHOW_CODE_VIEW").appendField(
      "-----------------------------------------"
    );
    this.appendDummyInput()
      .appendField("Loop")
      .appendField(new Blockly.FieldDropdown(() => loopTimes()), "LOOP");
    this.appendDummyInput()
      .appendField("Receiving Message? ")
      .appendField(
        new Blockly.FieldCheckbox("TRUE", (value) => {
          if ("FALSE" === value) {
            this.getField("message").setValue("");
          }
          return value;
        }),
        "receiving_message"
      );
    this.appendDummyInput()
      .appendField("Message:")
      .appendField(
        new Blockly.FieldTextInput("Hello World :)", (value) => {
          if (this.getFieldValue("receiving_message") === "FALSE") {
            return null;
          }
          return value;
        }),
        "message"
      );
    this.setColour(COLOR_THEME.ARDUINO);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["message_setup"] = messageSetupBlock;
