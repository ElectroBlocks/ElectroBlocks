import Blockly from "blockly";


function isPureNumber(str) {
  // Check if the string matches a valid number pattern
  const numberPattern = /^[+-]?\d+(\.\d+)?$/; // Matches integers and decimals
  return numberPattern.test(str);
}

Blockly["Python"] = Blockly["Python"] || {};
Blockly["Python"].imports_  = Blockly["Python"].imports_  || {};
Blockly["Python"].setupCode_ = Blockly["Python"].setupCode_ || {};

if (!Blockly.Python.imports_["import_time"]) {
  Blockly.Python.imports_["import_time"] = "import time\n";
}

Blockly["Python"]["time_setup"] = function (block) {
  return "";
}

if (!Blockly.Python.setupCode_["script_start"]) {
  Blockly.Python.setupCode_["script_start"] =
    "script_start = time.time()  # record start time\n";
}

Blockly["Arduino"]["time_seconds"] = function (block) {
  Blockly["Arduino"].functionNames_["secondsArduinoBeenOn"] =
    "double secondsArduinoBeenOn() {\n" + "\treturn millis() / 1000;\n" + "}\n";

  return ["secondsArduinoBeenOn()", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Python"]["time_seconds"] = function (block) {
  return ["time.time() - script_start", Blockly["Python"].ORDER_ATOMIC];
}

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

Blockly["Python"]["delay_block"] = function (block) {
  let delay =
    Blockly["Python"].valueToCode(
      block,
      "DELAY",
      Blockly["Python"].ORDER_ATOMIC
    ) || 1;
  if (!delay) delay = "1";

  if (isPureNumber(delay)) {
    return `time.sleep(${delay}) # Wait for the given/defined seconds.\n`;
  } else {
    return `time.sleep(round(${delay})) # Wait for the given/defined seconds.\n`;
  }
};

Blockly["Arduino"]["time_setup"] = function () {
  return "";
};

