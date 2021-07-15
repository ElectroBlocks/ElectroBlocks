import Blockly from "blockly";
import { COLOR_THEME } from "../../core/blockly/constants/colors";

import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";
import loopTimes from "../../core/blockly/helpers/looptimes";
Blockly.defineBlocksWithJsonArray([
  {
    type: "bluetooth_get_message",
    message0: "%1 bluetooth get message",
    args0: [
      {
        type: "field_image",
        src: "./blocks/bluetooth/bluetooth.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
    ],
    output: "String",
    colour: COLOR_THEME.COMPONENTS,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "bluetooth_has_message",
    message0: "%1 bluetooth received a message?",
    args0: [
      {
        type: "field_image",
        src: "./blocks/bluetooth/bluetooth.png",
        width: 15,
        height: 15,
        alt: "*",
        flipRtl: false,
      },
    ],
    output: "Boolean",
    colour: COLOR_THEME.COMPONENTS,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "bluetooth_send_message",
    message0: "%1 bluetooth send message %2",
    args0: [
      {
        type: "field_image",
        src: "./blocks/bluetooth/bluetooth.png",
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
    colour: COLOR_THEME.COMPONENTS,
    tooltip: "",
    helpUrl: "",
  },
]);

const bluetoothSetupBlock: any = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("/blocks/bluetooth/bluetooth.png", 15, 15)
      )
      .appendField("Bluetooth Setup");
    this.appendDummyInput()
      .appendField("RX Pin# ")
      .appendField(
        new Blockly.FieldDropdown(() => {
          return selectBoardBlockly().digitalPins;
        }),
        "PIN_RX"
      )
      .appendField("TX Pin#")
      .appendField(
        new Blockly.FieldDropdown(selectBoardBlockly().digitalPins),
        "PIN_TX"
      );
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
    this.setColour(COLOR_THEME.COMPONENTS);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.Blocks["bluetooth_setup"] = bluetoothSetupBlock;
