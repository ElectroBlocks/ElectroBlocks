import Blockly from "blockly";


function isPureNumber(str) {
  // Check if the string matches a valid number pattern
  const numberPattern = /^[+-]?\d+(\.\d+)?$/; // Matches integers and decimals
  return numberPattern.test(str);
}

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

  if (isPureNumber(delay)) {
    delay = Math.ceil(+delay * 1000);
    return `delay(${delay}); // Wait for the given/defined milliseconds.\n`;
  }
  return `delay(round(${delay} * 1000)); // Wait for the given/defined milliseconds.\n`;
};

Blockly["Arduino"]["time_setup"] = function () {
  return "";
};
