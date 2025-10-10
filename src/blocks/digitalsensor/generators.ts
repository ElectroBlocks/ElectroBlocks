import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["digital_read_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  Blockly["Arduino"].setupCode_[
    "digital_read" + pin
  ] = `   pinMode(${pin}, INPUT); // Configures defined pin as an input \n`;

  return "";
};

Blockly["Python"]["digital_read_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  Blockly["Python"].setupCode_[
    "config_digital_read"
  ] = `eb.config_digital_read(${pin}) # Set up digital read for pin ${pin}.\n`;

  return "";
};

Blockly["Python"]["digital_read"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  return [`eb.digital_read(${pin})`, Blockly["Python"].ORDER_ATOMIC];
};

Blockly["Arduino"]["digital_read"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  return ["digitalRead(" + pin + ")", Blockly["Arduino"].ORDER_ATOMIC];
};
