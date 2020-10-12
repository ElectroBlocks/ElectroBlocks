import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["digital_write"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  const state = block.getFieldValue("STATE") === "ON" ? "HIGH" : "LOW";

  return "digitalWrite(" + pin + ", " + state + "); \n";
};

Blockly["Arduino"]["analog_write"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  const numberToSend = Blockly["Arduino"].valueToCode(
    block,
    "WRITE_VALUE",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  return "analogWrite(" + pin + ", " + numberToSend + "); \n";
};
