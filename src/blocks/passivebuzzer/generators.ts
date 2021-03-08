import Blockly from "blockly";

Blockly["Arduino"]["passive_buzzer_note"] = function (block) {
  var tone = +block.getFieldValue("TONE");
  var pin = block.getFieldValue("PIN");
  // TODO: Assemble JavaScript into code variable.

  if (tone === 0) {
    return `noTone(${pin});`;
  }

  return `tone(${pin}, ${tone});`;
};

Blockly["Arduino"]["passive_buzzer_tone"] = function (block) {
  var tone = +Blockly["Arduino"].valueToCode(
    block,
    "TONE",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  var pin = block.getFieldValue("PIN");

  if (tone === 0) {
    return `noTone(${pin});`;
  }

  return `tone(${pin}, ${tone});`;
};
