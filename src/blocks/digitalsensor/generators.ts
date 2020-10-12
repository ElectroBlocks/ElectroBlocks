import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["digital_read_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  Blockly["Arduino"].setupCode_["digital_read" + pin] =
    "\tpinMode(" + pin + ", INPUT); \n";

  return "";
};

Blockly["Arduino"]["digital_read"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  return ["digitalRead(" + pin + ")", Blockly["Arduino"].ORDER_ATOMIC];
};
