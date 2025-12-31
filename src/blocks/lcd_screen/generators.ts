import Blockly, { CodeGenerator } from "blockly";
import { numberToCode } from "../../core/blockly/helpers/number-code.helper";
import { isPureNumber } from "../time/generators";

Blockly["Python"]["lcd_setup"] = function (block) {
  const size = block.getFieldValue("SIZE");
  const memoryType = block.getFieldValue("MEMORY_TYPE") == "0x3F" ? 63 : 39;

  const numberOfRows = size === "16 x 2" ? 2 : 4;
  const numberOfColumns = size === "16 x 2" ? 16 : 20;
  Blockly["Python"].setupCode_[
    "rgb_setup"
  ] = `eb.config_lcd(${numberOfRows}, ${numberOfColumns}, ${memoryType}) # Configures the LCD Screen pins\n`;
  return "";
};

Blockly["Arduino"]["lcd_setup"] = function (block) {
  const size = block.getFieldValue("SIZE");
  const memoryAddressLCDType = block.getFieldValue("MEMORY_TYPE").toUpperCase();

  const numberOfRows = size === "16 x 2" ? 2 : 4;
  const numberOfColumns = size === "16 x 2" ? 16 : 20;
  Blockly["Arduino"].libraries_["define_wire"] =
    "#include <Wire.h>;  // Include the Wire library for I2C communication.";
  Blockly["Arduino"].libraries_["define_liquid_crystal_i2c_big"] =
    "#include <LiquidCrystal_I2C.h>;  // Include the LiquidCrystal_I2C library for controlling the LCD";
  Blockly["Arduino"].libraries_["liquid_crystal_ic2_lcd_object"] =
    "LiquidCrystal_I2C lcd(" +
    memoryAddressLCDType +
    "," +
    numberOfRows +
    "," +
    numberOfColumns +
    `); // Create an LCD object with I2C address ${memoryAddressLCDType}, ${numberOfRows} rows, and ${numberOfColumns} columns`;

  Blockly["Arduino"].setupCode_[
    "liquid_crystal_ic2_lcd"
  ] = `   lcd.init(); // Initialize the LCD
   lcd.backlight(); // Turn on the LCD backlight\n`;

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

Blockly["Python"]["lcd_scroll"] = function (block) {
  const dropdown_dir = block.getFieldValue("DIR");
  if (dropdown_dir === "RIGHT") {
    return "eb.lcd_scrollright() \n";
  } else {
    return "eb.lcd_scrollleft() \n";
  }
};

Blockly["Arduino"]["lcd_screen_simple_print"] = function (
  block,
  generator: CodeGenerator
) {
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
  const workspace = Blockly.getMainWorkspace();
  const setupblock = workspace
    .getAllBlocks()
    .find((b) => b.type === "lcd_setup");
  let numRows = 2;
  if (setupblock) {
    const size = setupblock.getFieldValue("SIZE");
    numRows = size === "16 x 2" ? 2 : 4;
  }
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
  let seconds = Blockly["Arduino"].valueToCode(
    block,
    "DELAY",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  function printRow(row, textRow) {
    if (textRow !== '""' && textRow !== "") {
      return `lcd.setCursor(0, ${row}); // Print a message on the LCD screen
lcd.print(${textRow}); // Prints a message on LCD Screen.`;
    }
    return "";
  }

  const row3 = numRows === 2 ? "" : printRow(2, textRow3);
  const row4 = numRows === 2 ? "" : printRow(3, textRow4);
  if (isPureNumber(seconds)) {
    seconds = Math.ceil(+seconds * 1000);
  } else {
    seconds = `round(${seconds} * 1000)`;
  }
  let code = `lcd.clear(); // Clear LCD Screen
${printRow(0, textRow1)}
${printRow(1, textRow2)}`;

  if (row3 !== "") {
    code += `\n${row3}`;
  }
  if (row4 !== "") {
    code += `\n${row4}`;
  }
  code += `\ndelay(${seconds}); // Wait ${seconds / 1000} seconds
lcd.clear(); // Clear LCD Screen

`;
  return code;
};

Blockly["Python"]["lcd_screen_simple_print"] = function (
  block,
  generator: CodeGenerator
) {
  Blockly["Python"].imports_["delay"] =
    "import time # imports the time library\n";

  const textRow1 = Blockly["Python"].valueToCode(
    block,
    "ROW_1",
    Blockly["Python"].ORDER_ATOMIC
  );
  const textRow2 = Blockly["Python"].valueToCode(
    block,
    "ROW_2",
    Blockly["Python"].ORDER_ATOMIC
  );
  const workspace = Blockly.getMainWorkspace();
  const setupblock = workspace
    .getAllBlocks()
    .find((b) => b.type === "lcd_setup");
  let numRows = 2;
  if (setupblock) {
    const size = setupblock.getFieldValue("SIZE");
    numRows = size === "16 x 2" ? 2 : 4;
  }

  const textRow3 = Blockly["Python"].valueToCode(
    block,
    "ROW_3",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  const textRow4 = Blockly["Python"].valueToCode(
    block,
    "ROW_4",
    Blockly["Python"].ORDER_ATOMIC
  );
  const seconds = Blockly["Python"].valueToCode(
    block,
    "DELAY",
    Blockly["Python"].ORDER_ATOMIC
  );

  if (numRows == 2) {
    return `eb.lcd_clear() #clear screen
eb.lcd_print(0, 0, ${textRow1}) # Print the first row text on the LCD screen
eb.lcd_print(1, 0, ${textRow2}) # Print the second row text on the LCD screen
time.sleep(${seconds}) # Pause / Wait
eb.lcd_clear() # clear screen\n`;
  }

  return `eb.lcd_clear() #clear screen
eb.lcd_print(0, 0, ${textRow1}) # Print the first row text on the LCD screen
eb.lcd_print(1, 0, ${textRow2}) # Print the second row text on the LCD screen
eb.lcd_print(2, 0, ${textRow3}) # Print the third row text on the LCD screen
eb.lcd_print(3, 0, ${textRow4}) # Print the fourth row text on the LCD screen
time.sleep(${seconds}) # Wait for ${seconds} seconds
eb.lcd_clear() # clear screen\n`;
};

Blockly["Arduino"]["lcd_backlight"] = function (block) {
  return block.getFieldValue("BACKLIGHT").toUpperCase() === "ON"
    ? "lcd.backlight(); // Turn on backlight\n"
    : "lcd.noBacklight(); // Turn off backlight\n";
};

Blockly["Python"]["lcd_backlight"] = function (block) {
  return block.getFieldValue("BACKLIGHT").toUpperCase() === "ON"
    ? "eb.lcd_toggle_backlight(True) # Turn on the LCD backlight\n"
    : "eb.lcd_toggle_backlight(False) # Turn off the LCD backlight\n";
};

Blockly["Arduino"]["lcd_screen_clear"] = function (block) {
  return "lcd.clear(); // Clear LCD Screen.\n";
};

Blockly["Python"]["lcd_screen_clear"] = function (block) {
  return "eb.lcd_clear() # Clear the LCD screen\n";
};

Blockly["Arduino"]["lcd_screen_print"] = function (block) {
  let row = numberToCode(
    Blockly["Arduino"].valueToCode(
      block,
      "ROW",
      Blockly["Arduino"].ORDER_ATOMIC
    )
  );
  let column = numberToCode(
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

  return `lcd.setCursor(${column}, ${row}); // Set position to print on the LCD screen 
lcd.print(${message}); // Print a message on the LCD screen\n`;
};

Blockly["Python"]["lcd_screen_print"] = function (block) {
  let row = numberToCode(
    Blockly["Python"].valueToCode(block, "ROW", Blockly["Python"].ORDER_ATOMIC)
  );
  let column = numberToCode(
    Blockly["Python"].valueToCode(
      block,
      "COLUMN",
      Blockly["Python"].ORDER_ATOMIC
    )
  );
  const message = Blockly["Python"].valueToCode(
    block,
    "PRINT",
    Blockly["Python"].ORDER_ATOMIC
  );

  return `eb.lcd_print(${row}, ${column}, ${message}) # Print a message on the LCD screen at specified row and column\n`;
};

Blockly["Arduino"]["lcd_blink"] = function (block) {
  let row = numberToCode(
    Blockly["Arduino"].valueToCode(
      block,
      "ROW",
      Blockly["Arduino"].ORDER_ATOMIC
    )
  );
  let column = numberToCode(
    Blockly["Arduino"].valueToCode(
      block,
      "COLUMN",
      Blockly["Arduino"].ORDER_ATOMIC
    )
  );
  const blink = block.getFieldValue("BLINK").toUpperCase() === "BLINK";

  let code = "lcd.setCursor(" + column + ", " + row + ");\n";
  code += blink ? "lcd.blink();\n" : "lcd.noBlink();\n";

  return code;
};

Blockly["Python"]["lcd_blink"] = function (block) {
  let row = numberToCode(
    Blockly["Arduino"].valueToCode(
      block,
      "ROW",
      Blockly["Arduino"].ORDER_ATOMIC
    )
  );
  let column = numberToCode(
    Blockly["Arduino"].valueToCode(
      block,
      "COLUMN",
      Blockly["Arduino"].ORDER_ATOMIC
    )
  );
  const blink = block.getFieldValue("BLINK").toUpperCase() === "BLINK";

  return `eb.lcd_blink_curor(${row}, ${column}, ${
    blink ? "True" : "False"
  }) # Turn ${blink ? "on" : "off"} the blink.\n`;
};