import Blockly from "blockly";
import { Block } from "blockly";
import _ from "lodash";

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

Blockly["Arduino"]["arduino_loop"] = function (block: Block) {
  const statementsLoop = Blockly["Arduino"].statementToCode(block, "loop");

  let resetBluetoothVariable = "";
  let resetMessageVariable = "";
  let resetIrRemoteCode = "";
  let getNewTempReading = "";
  let setJoyStickValues = "";
  let setSerialMessageDEV = "";

  if (!_.isEmpty(Blockly["Arduino"].setupCode_["bluetooth_setup"])) {
    resetBluetoothVariable = '\tbluetoothMessageDEV = ""; \n';
  }

  if (!_.isEmpty(Blockly["Arduino"].setupCode_["joystick"])) {
    setJoyStickValues = "\tsetJoyStickValues(); \n";
  }

  if (
    !_.isEmpty(Blockly["Arduino"].setupCode_["serial_begin"]) &&
    Blockly["Arduino"].information_["message_recieve_block"]
  ) {
    resetMessageVariable = ' serialMessageDEV= ""; \n';
    setSerialMessageDEV = "  setSerialMessage();\n";
  }

  if (!_.isEmpty(Blockly["Arduino"].setupCode_["setup_ir_remote"])) {
    resetIrRemoteCode =
      "  irReceiver.resume(); // Prepare the receiver to receive the next IR signal. \n";
  }

  if (!_.isEmpty(Blockly["Arduino"].functionNames_["takeTempReading"])) {
    getNewTempReading = "\ttakeTempReading(); \n";
  }
  return (
    "// The void loop function runs over and over again forever." +
    "\nvoid loop() { \n" +
    setSerialMessageDEV +
    statementsLoop +
    resetBluetoothVariable +
    resetMessageVariable +
    resetIrRemoteCode +
    getNewTempReading +
    setJoyStickValues +
    "}"
  );
};
