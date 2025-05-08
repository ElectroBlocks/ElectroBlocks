import Blockly from "blockly";


function isPureNumber(str) {
  // Check if the string matches a valid number pattern
  const numberPattern = /^[+-]?\d+(\.\d+)?$/; // Matches integers and decimals
  return numberPattern.test(str);
}

function im_time() {
  if (!Blockly["Python"].imports_["import_time"]) {
    Blockly["Python"].imports_["import_time"] = `import time`;
  }
}

Blockly["Arduino"]["time_seconds"] = function (block) {
  Blockly["Arduino"].functionNames_["secondsArduinoBeenOn"] =
    "double secondsArduinoBeenOn() {\n" + "\treturn millis() / 1000;\n" + "}\n";

  return ["secondsArduinoBeenOn()", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Python"]["time_seconds"] = function (block) {
  im_time();
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
  im_time();
  let delay =
    Blockly["Python"].valueToCode(
      block,
      "DELAY",
      Blockly["Python"].ORDER_ATOMIC
    ) || 1;
  if (/^[+-]?\d+(\.\d+)?$/.test(delay)) {
    // pure number → sleep that many seconds
    return `time.sleep(${delay})  # Wait ${delay} s\n`;
  } else {
    // expression → round it
    return `time.sleep(round(${delay}))  # Wait computed seconds\n`;
  }
};

Blockly["Arduino"]["time_setup"] = function () {
  return "";
};

Blockly["Python"]["time_setup"] = function () {
  return "";
};
