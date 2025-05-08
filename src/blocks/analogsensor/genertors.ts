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
    Blockly["Python"].imports_["pyfirmata"]=`from pyfirmata import Arduino, util`;
    Blockly["Python"].imports_["import time"] = `import time`;
    Blockly["Python"].imports_["import serial"] = `import serial`;
}
  if(!Blockly["Python"].setupCode_["pyfirmata_board"]){
    Blockly["Python"].setupCode_["pyfirmata_board"] =
      "board = Arduino('YOUR PORT HERE')\n"+
      "it = util.Iterator(board)\n"+
      "it.start()\n";
  }
}

Blockly["Python"]["analog_read_setup"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  firmata();
  const pinVar = `analog_pin_${pin}`;
  
  Blockly["Python"].setupCode_[pinVar] =
  `${pinVar} = board.get_pin('a:${pin}:i')\n`+
  `${pinVar}.enable_reporting()\n`;
  return "";
};

Blockly["Arduino"]["analog_read"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  return ["(double)analogRead(" + pin + ")", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Python"]["analog_read"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  const pinVar = `analog_pin_${pin}`;
  return [`${pinVar}.read()`, Blockly["Python"].ORDER_ATOMIC];
};
