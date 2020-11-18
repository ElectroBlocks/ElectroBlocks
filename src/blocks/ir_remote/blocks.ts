import Blockly from "blockly";
import loopTimes from "../../core/blockly/helpers/looptimes";
import { COLOR_THEME } from "../../core/blockly/constants/colors";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";
import { virtualCircuitComment, whatIsAPin } from "../comment-text";


Blockly.Blocks["ir_remote_get_code"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/ir_remote/ir_remote.png", 15, 15)
      )
      .appendField("get ir remote code.");
    this.setOutput(true, "String");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      "Get's the message that the ir remote received."
    );
    this.comment.setBubbleSize(460, 60);

  },
};

Blockly.Blocks["ir_remote_has_code_receive"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/ir_remote/ir_remote.png", 15, 15)
      )
      .appendField("is receiving a code?");
    this.setOutput(true, "Boolean");
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      "Returns true if the ir sensor has received a message."
    );
    this.comment.setBubbleSize(460, 60);
  },
};

const irSetupBlock: any = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldImage("./blocks/ir_remote/ir_remote.png", 15, 15)
      )
      .appendField("Setup IR Remote");
    this.appendDummyInput()
      .appendField("Analog Pin# ")
      .appendField(
        new Blockly.FieldDropdown(() => selectBoardBlockly().analogPins),
        "PIN"
      );
    this.appendDummyInput("SHOW_CODE_VIEW").appendField(
      "-----------------------------"
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
      .appendField("Scan New Code? ")
      .appendField(
        new Blockly.FieldCheckbox("TRUE", (value) => {
          if ("FALSE" === value) {
            this.getField("code").setValue("");
          }
          return value;
        }),
        "scanned_new_code"
      );
    this.appendDummyInput()
      .appendField("Code")
      .appendField(
        new Blockly.FieldTextInput("E932B", (value) => {
          if (this.getFieldValue("scanned_new_code") === "FALSE") {
            return null;
          }
          return value;
        }),
        "code"
      );
    this.setColour(COLOR_THEME.SENSOR);
    this.setTooltip("");
    this.setHelpUrl("");
    this.setCommentText(
      `This block sets up the ir remote sensor.${virtualCircuitComment}`
    );
    this.comment.setBubbleSize(460, 100);

  },
};

Blockly.Blocks["ir_remote_setup"] = irSetupBlock;
