import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["analog_read_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  Blockly["Arduino"].setupCode_["analog_read" + pin] =
    "\tpinMode(" + pin + ", INPUT); \n";

  return "";
};

Blockly["Arduino"]["analog_read"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  return ["(double)analogRead(" + pin + ")", Blockly["Arduino"].ORDER_ATOMIC];
};
