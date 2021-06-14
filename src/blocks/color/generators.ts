import Blockly from "blockly";

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

Blockly["Arduino"]["color_picker_custom"] = function (block) {
  const rgb = hexToRgb(block.getFieldValue("COLOR"));

  return [
    "{ " + rgb.r + ", " + rgb.g + ", " + rgb.b + "}",
    Blockly["Arduino"].ORDER_ATOMIC,
  ];
};

Blockly["Arduino"]["colour_random"] = function (block) {
  return [
    "{ random(0, 255), random(0, 255), random(0, 255)}",
    Blockly["Arduino"].ORDER_ATOMIC,
  ];
};

Blockly["Arduino"]["colour_rgb"] = function (block) {
  const red = Blockly["Arduino"].valueToCode(
    block,
    "RED",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  const green = Blockly["Arduino"].valueToCode(
    block,
    "GREEN",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  const blue = Blockly["Arduino"].valueToCode(
    block,
    "BLUE",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  return [
    "{ " + red + ", " + green + ", " + blue + "}",
    Blockly["Arduino"].ORDER_ATOMIC,
  ];
};
