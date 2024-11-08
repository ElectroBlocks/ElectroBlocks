import Blockly, { type BlockSvg } from "blockly";

Blockly["Arduino"]["button_setup"] = function (block: BlockSvg) {
  const pin = block.getFieldValue("PIN");

  Blockly["Arduino"].setupCode_[
    "btn_pin_" + pin
  ] = `\tpinMode(${pin}, INPUT); \n`;

  return "";
};

Blockly["Arduino"]["is_button_pressed"] = function (block: BlockSvg) {
  const pin = block.getFieldValue("PIN");
  return [`(digitalRead(${pin}) == HIGH)`, Blockly["Arduino"].ORDER_ATOMIC];
};

// This is a simulation only block
Blockly["Arduino"]["release_button"] = function (block: BlockSvg) {
  return "";
};
