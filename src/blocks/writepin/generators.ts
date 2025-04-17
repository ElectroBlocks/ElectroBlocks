import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["digital_write"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");

  const state = block.getFieldValue("STATE") === "ON" ? "HIGH" : "LOW";

  return "digitalWrite(" + pin + ", " + state + "); \n";
};

export function setup_code() {
  if(!Blockly["Python"].setupCode_["board_port"]) {
    Blockly["Python"].setupCode_["board_port"] =
      `PORT = "YOUR_PORT_HERE"\n`+
      `board = pyfirmata.Arduino(PORT)\n`+
      `\n`+
      `#Start the iterator thread to read inputs\n`+
      `it = pyfirmata.util.Iterator(board)\n`+
      `it.start()`+
      `\n`;
  }
}

Blockly["Python"]["digital_write"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  
  const state = block.getFieldValue("STATE") === "ON" ? "1" : "0";

  Blockly["Python"].imports_["import_mods"] = `from pyfirmata import Arduino, util\nimport time`;
  setup_code();
  const code = `board.digital[${pin}].write(${state})\n`+
  `time.sleep(0.01)\n`;
  return code;
 };
  

Blockly["Arduino"]["analog_write"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  const numberToSend = Blockly["Arduino"].valueToCode(
    block,
    "WRITE_VALUE",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  return "analogWrite(" + pin + ", " + numberToSend + "); \n";
};

Blockly["Python"]["analog_write"] = function (block: Block) {
  const pin = block.getFieldValue("PIN");
  // Grab the value plugged into the WRITE_VALUE input (0.0–1.0)
  const value = Blockly["Python"].valueToCode(
    block,
    "WRITE_VALUE",
    Blockly["Python"].ORDER_ATOMIC
  ) || "0";

  // ensure pyFirmata + time are imported
  Blockly["Python"].imports_["import_mods"] =
    'from pyfirmata import Arduino, util\nimport time';

  // make sure board/iterator setup is in place
  setup_code();

  // write the PWM duty cycle, then a tiny pause
  const code =
    `board.get_pin('d:${pin}:p').write(${value})\n` +
    `time.sleep(0.01)\n`;

  return code;
};

