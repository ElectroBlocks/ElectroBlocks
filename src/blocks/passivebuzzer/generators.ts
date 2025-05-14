import Blockly from "blockly";

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

Blockly["Python"]["passive_buzzer_note"] = function (block) {
  var tone = +block.getFieldValue("TONE");
  var pin = block.getFieldValue("PIN");
  Blockly["Python"].setupCode_[`buzzer_pin_${pin}`] =
  `buzzer_pin_${pin} = board.get_pin('d:${pin}:p')`;

  if (tone === 0) {
    return `buzzer_pin_${pin}.write(0)\n`;
  }
  return `
buzzer_pin_${pin}.write(${tone})  # Start tone (simulate square wave)
time.sleep(1)
buzzer_pin_${pin}.write(0)
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

Blockly["Python"]["passive_buzzer_tone"] = function (block) {
  var tone = +Blockly["Python"].valueToCode(
    block,
    "TONE",
    Blockly["Python"].ORDER_ATOMIC
  );
  var pin = block.getFieldValue("PIN");
  Blockly["Python"].setupCode_[`passive_buzzer_pin_${pin}`] = 
  `passive_buzzer_pin_${pin} = board.get_pin('d:${pin}:p')\n`;

  if (tone === 0) {
    return `passive_buzzer_pin_${pin}.write(0)\n`;
  }
  return `
passive_buzzer_pin_${pin}.write(${tone})
time.sleep(1)
passive_buzzer_pin_${pin}.write(0)
`
};

Blockly["Arduino"]["passive_buzzer_simple"] =
  Blockly["Arduino"]["passive_buzzer_note"];

Blockly["Python"]["passive_buzzer_simple"] =
  Blockly["Python"]["passive_buzzer_note"];
