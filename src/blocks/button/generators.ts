import Blockly, { type BlockSvg } from "blockly";

Blockly["Arduino"]["button_setup"] = function (block: BlockSvg) {
  const pin = block.getFieldValue("PIN");
  const inputType = "INPUT_PULLUP";

  Blockly["Arduino"].setupCode_[
    "btn_pin_" + pin
  ] = `   // button pin uses internal pull-up resistor.  LOW mean on and HIGH means off.
   pinMode(${pin}, ${inputType}); \n`;

  return "";
};

Blockly["Python"]["button_setup"] = function (block: BlockSvg) {
  const pin = block.getFieldValue("PIN");

  Blockly["Python"].setupCode_[
    "button_setup"
  ] = `eb.config_button(${pin}) # Set up button for pin ${pin}.\n`;
  return "";
};

Blockly["Python"]["is_button_pressed"] = function (block: BlockSvg) {
  const pin = block.getFieldValue("PIN");

  return [`eb.is_button_pressed(${pin})`, Blockly["Python"].ORDER_ATOMIC];
};

Blockly["Arduino"]["is_button_pressed"] = function (block: BlockSvg) {
  const pin = block.getFieldValue("PIN");
  return [`(digitalRead(${pin}) == LOW)`, Blockly["Arduino"].ORDER_ATOMIC];
};

// This is a simulation only block
Blockly["Arduino"]["release_button"] = function (block: BlockSvg) {
  return "";
};

Blockly["Python"]["release_button"] = function (block: BlockSvg) {
  return "";
};
