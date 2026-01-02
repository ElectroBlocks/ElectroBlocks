import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["digital_write"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  Blockly["Arduino"].setupCode_["digital_write_" + pin] =
    "   pinMode(" + pin + ", OUTPUT);  // Configures led pin as an output\n";

  const state = block.getFieldValue("STATE") === "ON" ? "HIGH" : "LOW";

  return "digitalWrite(" + pin + ", " + state + "); \n";
};

Blockly["Python"]["digital_write"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  const state = block.getFieldValue("STATE");
  Blockly["Python"].setupCode_[
    "write_pin_" + pin
  ] = `eb.digital_write_config(${pin})\n`;

  const ledState = state === "ON" ? "1" : "0";
  return `eb.digital_write(${pin}, ${ledState}) # Turns the led ${state.toLowerCase()}\n`;
};

Blockly["Arduino"]["analog_write"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  Blockly["Arduino"].setupCode_["analog_write_" + pin] =
    "   pinMode(" + pin + ", OUTPUT);  // Configures led pin as an output\n";

  const numberToSend = Blockly["Arduino"].valueToCode(
    block,
    "WRITE_VALUE",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  return "analogWrite(" + pin + ", " + numberToSend + "); \n";
};

Blockly["Python"]["analog_write"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  // Grab the value plugged into the WRITE_VALUE input (0.0–1.0)
  const value =
    Blockly["Python"].valueToCode(
      block,
      "WRITE_VALUE",
      Blockly["Python"].ORDER_ATOMIC
    ) || "0";

  Blockly["Python"].setupCode_[
    "write_pin_" + pin
  ] = `eb.analog_write_config(${pin})`;

  return `eb.analog_write(${pin}, ${value})\n`;
};

