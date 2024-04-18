import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["time_seconds"] = function (block) {
  Blockly["Arduino"].functionNames_["secondsArduinoBeenOn"] =
    "double secondsArduinoBeenOn() {\n" + "\treturn millis() / 1000;\n" + "}\n";

  return ["secondsArduinoBeenOn()", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["delay_block"] = function (block) {
  let delay =
    Blockly["Arduino"].valueToCode(
      block,
      "DELAY",
      Blockly["Arduino"].ORDER_ATOMIC
    ) || 1;
  delay = Math.ceil(Math.abs(delay) * 1000);

  return "delay(" + delay + ");\n";
};

Blockly["Arduino"]["time_setup"] = function () {
  return "";
};
