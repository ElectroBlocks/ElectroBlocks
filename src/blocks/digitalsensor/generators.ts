import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["digital_read_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  Blockly["Arduino"].setupCode_[
    "digital_read" + pin
  ] = `   pinMode(${pin}, INPUT); // Configures defined pin as an input \n`;

  return "";
};

Blockly["Arduino"]["digital_read"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  return ["digitalRead(" + pin + ")", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly.Python["digital_read_setup"] = function (block) {
  const pin = block.getFieldValue("PIN");

  Blockly.Python.definitions_ = Blockly.Python.definitions_ || {};
  Blockly.Python.setups_ = Blockly.Python.setups_ || {};


  if (!Blockly.Python.definitions_["import_pyfirmata"]) {
    Blockly.Python.definitions_["import_pyfirmata"] = `
from pyfirmata import Arduino, util
import time

# Initialise the program settings and configurations
PORT = "/dev/ttyACM0"  # Change this to your Arduino port
board = Arduino(PORT)

# Start the iterator thread to read inputs
it = util.Iterator(board)
it.start()
time.sleep(1)  # Give time for Arduino to start communicating
`;
  }


  Blockly.Python.setups_[`digital_read_pin_${pin}`] = `
digital_read_pin_${pin} = board.digital[${pin}]
digital_read_pin_${pin}.mode = util.INPUT`;

  return "";
};

Blockly.Python["digital_read"] = function (block) {
  const pin = block.getFieldValue("PIN");
  return [`digital_read_pin_${pin}.read()`, Blockly.Python.ORDER_ATOMIC];
};
