import Blockly, { Block } from "blockly";

Blockly["Arduino"]["digital_display_setup"] = function (block: Block) {
  var dioPin = block.getFieldValue("DIO_PIN");
  var clkPin = block.getFieldValue("CLK_PIN");

  Blockly["Arduino"].libraries_["define_digital_display"] = `
const byte PIN_CLK = ${dioPin};   // define CLK pin (any digital pin)
const byte PIN_DIO = ${clkPin};   // define DIO pin (any digital pin)
SevenSegmentTM1637    digitalDisplay(PIN_CLK, PIN_DIO);
`;

  Blockly["Arduino"].setupCode_["digital_display_setup"] = `

    digitalDisplay.begin();
    digitalDisplay.setBacklight(100);

`;

  // TODO: Assemble JavaScript into code variable.
  var code = "";
  return code;
};

Blockly["Arduino"]["digital_display_set"] = function (block) {
  var text = Blockly["Arduino"].valueToCode(
    block,
    "TEXT",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  var colonOn = block.getFieldValue("COLON") == "TRUE";

  // display.clear();
  // display.setColonOn(true);
  // display.print("1200");

  // TODO: Assemble JavaScript into code variable.
  var code = `  display.clear();
  display.setColonOn(${colonOn});
  display.print(${text});
`;
  return code;
};
