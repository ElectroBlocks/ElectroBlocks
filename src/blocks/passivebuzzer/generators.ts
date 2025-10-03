import Blockly from "blockly";

Blockly["Python"]["passive_buzzer_note"] = function (block) {
  var tone = +block.getFieldValue("TONE");
  var pin = block.getFieldValue("PIN");
  // This will not work because arduino only supports one tone
  Blockly["Python"].setupCode_[
    "tone_" + pin
  ] = `eb.config_passive_buzzer(${pin})`;

  return `eb.play_passive_buzzer(${pin}, ${tone})
`;
};
Blockly["Arduino"]["passive_buzzer_note"] = function (block) {
  var tone = +block.getFieldValue("TONE");
  var pin = block.getFieldValue("PIN");
  Blockly["Arduino"].setupCode_["tone_pin_" + pin] =
    "\tpinMode(" + pin + ", OUTPUT); \n";

  if (tone === 0) {
    return `noTone(${pin});\n`;
  }

  return `tone(${pin}, ${tone});\n`;
};

Blockly["Python"]["passive_buzzer_tone"] = function (block) {
  var tone = +block.getFieldValue("TONE");
  var pin = block.getFieldValue("PIN");
  // This will not work because arduino only supports one tone
  Blockly["Python"].setupCode_[
    "tone_" + pin
  ] = `eb.config_passive_buzzer(${pin})`;

  return `eb.play_passive_buzzer(${pin}, ${tone})
`;
};

Blockly["Arduino"]["passive_buzzer_tone"] = function (block) {
  var tone = +Blockly["Arduino"].valueToCode(
    block,
    "TONE",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  var pin = block.getFieldValue("PIN");
  Blockly["Arduino"].setupCode_["tone_pin_" + pin] =
    "\tpinMode(" + pin + ", OUTPUT); \n";

  if (tone === 0) {
    return `noTone(${pin});\n`;
  }

  return `tone(${pin}, ${tone});\n`;
};

Blockly["Arduino"]["passive_buzzer_simple"] =
  Blockly["Arduino"]["passive_buzzer_note"];

Blockly["Python"]["passive_buzzer_simple"] =
  Blockly["Python"]["passive_buzzer_note"];