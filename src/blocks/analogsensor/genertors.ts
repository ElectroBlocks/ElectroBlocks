import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["analog_read_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  Blockly["Arduino"].setupCode_[
    "analog_read" + pin
  ] = `   pinMode(${pin}, INPUT); // Configures defined pin as an input \n`;

  return "";
};

function firmata () {
  if(!Blockly["Python"].imports_["pyfirmata"]) {
    Blockly["Python"].imports_["pyfirmata"]=`
from pyfirmata import Arduino, util
board = Arduino("YOUR_PORT_HERE")

it = util.Iterator(board)
it.start()
`
  }
  if(!Blockly["Python"].imports_["import_time"]){
    Blockly["Python"].imports_["import_time"] =`
import time
`
  }
};

Blockly["Python"]["analog_read_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  firmata();
  const pinVar = `analog_pin_${pin}`;
  
  Blockly["Python"].setupCode_[pinVar] =
  `${pinVar} = board.get_pin('a:${pin}:i')
${pinVar}.enable_reporting()
`;
  return "";
};

Blockly["Arduino"]["analog_read"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  return ["(double)analogRead(" + pin + ")", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Python"]["analog_read"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  const pinVar = `analog_pin_${pin}`;
  const code = `${pinVar}.read()`;
  return [code, Blockly["Python"].ORDER_ATOMIC];
};
