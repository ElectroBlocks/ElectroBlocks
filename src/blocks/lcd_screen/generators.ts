import Blockly from "blockly";

Blockly["Arduino"]["lcd_setup"] = function (block) {
  const size = block.getFieldValue("SIZE");
  const memoryAddressLCDType = block.getFieldValue("MEMORY_TYPE").toUpperCase();

  const numberOfRows = size === "16 x 2" ? 2 : 4;
  const numberOfColumns = size === "16 x 2" ? 16 : 20;
  Blockly["Arduino"].libraries_["define_wire"] = "#include <Wire.h>;\n";
  Blockly["Arduino"].libraries_["define_liquid_crystal_i2c_big"] =
    "#include <LiquidCrystal_I2C.h>;\n";
  Blockly["Arduino"].libraries_["liquid_crystal_ic2_lcd_object"] =
    "LiquidCrystal_I2C lcd(" +
    memoryAddressLCDType +
    "," +
    numberOfRows +
    "," +
    numberOfColumns +
    ");";

  Blockly["Arduino"].setupCode_["liquid_crystal_ic2_lcd"] =
    "" + "\tlcd.init();\n" + "\tlcd.backlight(); \n";

  return "";
};
Blockly["Arduino"]["lcd_scroll"] = function (block) {
  const dropdown_dir = block.getFieldValue("DIR");

  if (dropdown_dir === "RIGHT") {
    return "lcd.scrollDisplayRight(); \n";
  } else {
    return "lcd.scrollDisplayLeft(); \n";
  }
};

Blockly["Arduino"]["lcd_screen_simple_print"] = function (block) {
  const textRow1 = Blockly["Arduino"].valueToCode(
    block,
    "ROW_1",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  const textRow2 = Blockly["Arduino"].valueToCode(
    block,
    "ROW_2",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  const textRow3 = Blockly["Arduino"].valueToCode(
    block,
    "ROW_3",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  const textRow4 = Blockly["Arduino"].valueToCode(
    block,
    "ROW_4",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  const seconds = Blockly["Arduino"].valueToCode(
    block,
    "DELAY",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  function printRow(row, textRow) {
    return textRow !== '""'
      ? "lcd.setCursor(0, " + row + "); \n" + "lcd.print(" + textRow + "); \n"
      : "";
  }

  return (
    "lcd.clear(); \n" +
    printRow(0, textRow1) +
    printRow(1, textRow2) +
    printRow(2, textRow3) +
    printRow(3, textRow4) +
    "delay(" +
    seconds * 1000 +
    "); \n" +
    "lcd.clear(); \n"
  );
};

Blockly["Arduino"]["lcd_backlight"] = function (block) {
  return block.getFieldValue("BACKLIGHT").toUpperCase() === "ON"
    ? "\tlcd.backlight();\n"
    : "\tlcd.noBacklight();\n";
};

Blockly["Arduino"]["lcd_screen_clear"] = function (block) {
  return "\tlcd.clear();\n";
};

Blockly["Arduino"]["lcd_screen_print"] = function (block) {
  let row = parseInt(
    Blockly["Arduino"].valueToCode(
      block,
      "ROW",
      Blockly["Arduino"].ORDER_ATOMIC
    )
  );
  let column = parseInt(
    Blockly["Arduino"].valueToCode(
      block,
      "COLUMN",
      Blockly["Arduino"].ORDER_ATOMIC
    )
  );
  const message = Blockly["Arduino"].valueToCode(
    block,
    "PRINT",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  column = column > 0 ? column - 1 : 0;
  row = row > 0 ? row - 1 : 0;

  return (
    "\tlcd.setCursor(" +
    column +
    ", " +
    row +
    ");\n" +
    "\tlcd.print(" +
    message +
    "); \n"
  );
};

Blockly["Arduino"]["lcd_blink"] = function (block) {
  let row = parseInt(
    Blockly["Arduino"].valueToCode(
      block,
      "ROW",
      Blockly["Arduino"].ORDER_ATOMIC
    )
  );
  let column = parseInt(
    Blockly["Arduino"].valueToCode(
      block,
      "COLUMN",
      Blockly["Arduino"].ORDER_ATOMIC
    )
  );
  const blink = block.getFieldValue("BLINK").toUpperCase() === "BLINK";

  column = column > 0 ? column - 1 : 0;
  row = row > 0 ? row - 1 : 0;

  let code = "\tlcd.setCursor(" + column + ", " + row + ");\n";
  code += blink ? "\tlcd.blink();\n" : "\tlcd.noBlink();\n";

  return code;
};
