import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["led"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  const state = block.getFieldValue("STATE");

  Blockly["Arduino"].setupCode_["led_pin" + pin] =
    "\tpinMode(" + pin + ", OUTPUT); \n";
  const ledState = state === "ON" ? "HIGH" : "LOW";
  return "digitalWrite(" + pin + ", " + ledState + "); \n";
};

Blockly["Arduino"]["led_fade"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  const fadeNumber = Blockly["Arduino"].valueToCode(
    block,
    "FADE",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  Blockly["Arduino"].setupCode_["led_pin" + pin] =
    "\tpinMode(" + pin + ", OUTPUT); \n";

  return "analogWrite(" + pin + ", " + (fadeNumber || 1) + "); \n";
};
