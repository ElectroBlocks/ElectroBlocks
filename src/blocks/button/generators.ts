import Blockly, { type BlockSvg } from "blockly";

Blockly["Arduino"]["button_setup"] = function (block: BlockSvg) {
  const pin = block.getFieldValue("PIN");
  const usePullupResistor = block.getFieldValue("PULLUP_RESISTOR") == "TRUE";
  const inputType = usePullupResistor ? "INPUT_PULLUP" : "INPUT";
  if (Blockly["Arduino"].buttonTypes === undefined) {
    Blockly["Arduino"].buttonTypes = {
      [pin.toString()]: { usePullupResistor },
    };
  } else {
    Blockly["Arduino"].buttonTypes[pin] = { usePullupResistor };
  }
  Blockly["Arduino"].setupCode_[
    "btn_pin_" + pin
  ] = `   pinMode(${pin}, ${inputType}); // Set defined pin as an input${
    usePullupResistor ? " with an internal pull-up resistor.\n" : ".\n"
  }`;

  return "";
};

Blockly["Arduino"]["is_button_pressed"] = function (block: BlockSvg) {
  const pin = block.getFieldValue("PIN");
  const readType = Blockly["Arduino"].buttonTypes[pin].usePullupResistor
    ? "LOW"
    : // Changing to low for now
      "HIGH";
  return [
    `(digitalRead(${pin}) == ${readType})`,
    Blockly["Arduino"].ORDER_ATOMIC,
  ];
};

// This is a simulation only block
Blockly["Arduino"]["release_button"] = function (block: BlockSvg) {
  return "";
};

Blockly.Python["button_setup"] = function (block) {
  const pin = block.getFieldValue("PIN");
  const usePullup = block.getFieldValue("PULLUP_RESISTOR") === "TRUE";

  Blockly.Python.definitions_ = Blockly.Python.definitions_ || {};
  Blockly.Python.setups_ = Blockly.Python.setups_ || {};
  Blockly.Python.definitions_["import_pyfirmata"] = `
from pyfirmata import Arduino, util
board = Arduino('/dev/ttyACM0')  # Update with your port
it = util.Iterator(board)
it.start()
`;

  Blockly.Python.setups_[`btn_pin_${pin}`] = `
btn_pin_${pin} = board.digital[${pin}]
btn_pin_${pin}.mode = util.INPUT
`;

  // Store button logic for later reference
  Blockly.Python.buttonTypes = Blockly.Python.buttonTypes || {};
  Blockly.Python.buttonTypes[pin] = { usePullup };

  return "";
};
Blockly.Python["is_button_pressed"] = function (block) {
  const pin = block.getFieldValue("PIN");
  const usePullup = Blockly.Python.buttonTypes?.[pin]?.usePullup;

  const expectedValue = usePullup ? "0" : "1"; // LOW if pull-up used, else HIGH
  return [`(btn_pin_${pin}.read() == ${expectedValue})`, Blockly.Python.ORDER_ATOMIC];
};
Blockly.Python["release_button"] = function (block) {
  return "";
};

