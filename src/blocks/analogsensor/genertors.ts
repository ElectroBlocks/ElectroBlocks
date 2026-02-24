import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["analog_read_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  Blockly["Arduino"].setupCode_[
    "analog_read" + pin
  ] = `   pinMode(${pin}, INPUT); // Configures defined pin as an input \n`;

  return "";
};

Blockly["Arduino"]["analog_read"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  return ["(double)analogRead(" + pin + ")", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Python"]["analog_read"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  return ["eb.analog_read('" + pin + "')", Blockly["Python"].ORDER_ATOMIC];
};

Blockly["Python"]["analog_read_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  Blockly["Python"].setupCode_[
    "analog_read_config" + pin
  ] = `eb.analog_read_config('${pin}') # Set up analog read for pin ${pin}.\n`;

  return "";
};
