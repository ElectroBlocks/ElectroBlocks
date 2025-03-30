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

function createColorStruct() {
  Blockly["Arduino"].libraries_["color_struct"] = `struct RGB {
    int red;
    int green;
    int blue;
};`;
}

function createColorStructPy() {
  Blockly["Python"].imports_["import_dataclass"] = `
from dataclasses import dataclass`
  Blockly["Python"].functionNames_["color_struct"] = `  
@dataclass
class RGB:
  red: int
  green: int
  blue: int
  `;
}

Blockly["Arduino"]["color_picker_custom"] = function (block) {
  const rgb = hexToRgb(block.getFieldValue("COLOR"));
  createColorStruct();
  return [
    "{ " + rgb.r + ", " + rgb.g + ", " + rgb.b + "}",
    Blockly["Arduino"].ORDER_ATOMIC,
  ];
};

Blockly["Python"]["color_picker_custom"] = function (block) {
  const rgb = hexToRgb(block.getFieldValue("COLOR"));
  createColorStructPy();
  return [
    `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    Blockly["Python"].ORDER_ATOMIC,
  ];
};



Blockly["Arduino"]["colour_random"] = function (block) {
  createColorStruct();
  return [
    "{ random(0, 255), random(0, 255), random(0, 255)}",
    Blockly["Arduino"].ORDER_ATOMIC,
  ];
};

Blockly["Python"]["colour_random"] = function (block) {
  createColorStructPy();

  Blockly["Python"].imports_["import_random"] = "import random";

  return [
    "RGB(random.randint(0, 255), random.randint(0,255), radnom.randit(0,255))",
    Blockly["Python"].ORDER_ATOMIC,
  ];
};

Blockly["Arduino"]["colour_rgb"] = function (block) {
  createColorStruct();
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

Blockly["Python"]["colour_rgb"] = function (block) {
  createColorStructPy();
  const red = Blockly["Python"].valueToCode(
    block,
    "RED",
    Blockly["Python"].ORDER_ATOMIC
  );
  const green = Blockly["Python"].valueToCode(
    block,
    "GREEN",
    Blockly["Python"].ORDER_ATOMIC
  );
  const blue = Blockly["Python"].valueToCode(
    block,
    "BLUE",
    Blockly["Python"].ORDER_ATOMIC
  );
  
  return [
    `RGB(${red}, ${green}, ${blue})`,
    Blockly["Python"].ORDER_ATOMIC
  ];
};


