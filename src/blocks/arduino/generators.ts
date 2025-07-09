import Blockly from "blockly";
import { Block } from "blockly";
import _ from "lodash";
import { getBlockByType } from "../../core/blockly/helpers/block.helper";

Blockly["Python"]["arduino_setup"] = function (block: Block) {
  return "";
};

Blockly["Arduino"]["arduino_setup"] = function (block: Block) {
  const statementsSetup = Blockly["Arduino"].statementToCode(block, "setup");

  return (
    "\n// Initialise the program settings and configurations" +
    "\nvoid setup() { \n" +
    "__REPLACE_WITH_SETUP_CODE" +
    statementsSetup +
    "}\n"
  );
};

Blockly["Python"]["arduino_loop"] = function (block: Block) {
  const statementsLoop = Blockly["Python"].statementToCode(block, "loop");
  return `
while True:
${statementsLoop}
`;
};

Blockly["Arduino"]["arduino_loop"] = function (block: Block) {
  const statementsLoop = Blockly["Arduino"].statementToCode(block, "loop");

  let resetBluetoothVariable = "";
  let resetMessageVariable = "";
  let resetIrRemoteCode = "";
  let getNewTempReading = "";
  let setJoyStickValues = "";
  let setSerialMessageDEV = "";

  if (getBlockByType("bluetooth_setup")?.isEnabled()) {
    resetBluetoothVariable = '\tbluetoothMessageDEV = ""; \n';
  }

  if (getBlockByType("joystick_setup")?.isEnabled()) {
    setJoyStickValues = "\tsetJoyStickValues(); \n";
  }

  if (
    getBlockByType("arduino_get_message")?.isEnabled() &&
    getBlockByType("message_setup")?.isEnabled()
  ) {
    resetMessageVariable = ' serialMessageDEV= ""; \n';
    setSerialMessageDEV = "  setSerialMessage();\n";
  }

  if (getBlockByType("ir_remote_setup")?.isEnabled()) {
    resetIrRemoteCode =
      "  irReceiver.resume(); // Prepare the receiver to receive the next IR signal. \n";
  }

  return (
    "// The void loop function runs over and over again forever." +
    "\nvoid loop() { \n" +
    setSerialMessageDEV +
    statementsLoop +
    resetBluetoothVariable +
    resetMessageVariable +
    resetIrRemoteCode +
    setJoyStickValues +
    "}"
  );
};
