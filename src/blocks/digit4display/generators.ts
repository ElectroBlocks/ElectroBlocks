import Blockly, { type Block } from "blockly";

Blockly["Arduino"]["digital_display_setup"] = function (block: Block) {
  let dioPin = block.getFieldValue("DIO_PIN");
  let clkPin = block.getFieldValue("CLK_PIN");

  Blockly["Arduino"].libraries_["define_digital_display"] = `
#include "SevenSegmentTM1637.h"
const byte PIN_CLK = ${dioPin};   // define CLK pin (any digital pin)
const byte PIN_DIO = ${clkPin};   // define DIO pin (any digital pin)
SevenSegmentTM1637    digitalDisplay(PIN_CLK, PIN_DIO);
`;

  Blockly["Arduino"].setupCode_[
    "digital_display_setup"
  ] = `  digitalDisplay.begin();
    digitalDisplay.setBacklight(100);
`;

  let code = "";
  return code;
};

Blockly["Arduino"]["digital_display_set"] = function (block) {
  let text = Blockly["Arduino"].valueToCode(
    block,
    "TEXT",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  let colonOn = block.getFieldValue("COLON") == "TRUE";

  // This has to 4 in order to get the colons to work

  let code = `
  digitalDisplay.clear();
  digitalDisplay.setColonOn(${colonOn});
  digitalDisplay.print(${text});
`;
  return code;
};
