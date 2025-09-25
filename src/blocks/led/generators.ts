import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["led"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  const state = block.getFieldValue("STATE");

  Blockly["Arduino"].setupCode_["led_pin" + pin] =
    "   pinMode(" + pin + ", OUTPUT);  // Configures led pin as an output\n";
  const ledState = state === "ON" ? "HIGH" : "LOW";
  return `digitalWrite(${pin}, ${ledState}); // Set defined pin to ${
    ledState == "HIGH" ? "HIGH (turn it on)." : "LOW (turn it off)."
  }\n`;
};

Blockly["Python"]["led"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  const state = block.getFieldValue("STATE");

  const ledState = state === "ON" ? "1" : "0";
  return `board.digital[${pin}].write(${ledState}); // Set defined pin to ${
    ledState == "1" ? "1 (turn it on)." : "0 (turn it off)."
  }\n`;
};


Blockly["Arduino"]["led_fade"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  const fadeNumber = Blockly["Arduino"].valueToCode(
    block,
    "FADE",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  Blockly["Arduino"].setupCode_["led_pin" + pin] =
    "   pinMode(" + pin + ", OUTPUT); // Configures led pin as an output\n";

  return "analogWrite(" + pin + ", " + (fadeNumber || 1) + "); \n";
};
