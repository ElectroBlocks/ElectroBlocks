import Blockly from "blockly";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";

Blockly["Arduino"]["bluetooth_setup"] = function (block) {
  const rxPin = block.getFieldValue("PIN_RX");
  const txPin = block.getFieldValue("PIN_TX");
  Blockly["Arduino"].libraries_["define_bluetooth"] =
    "\n#include <SoftwareSerial.h>;\nSoftwareSerial blueToothSerial(" +
    txPin +
    ", " +
    rxPin +
    "); \n\n";
  Blockly["Arduino"].functionNames_[
    "getBluetoothMessage"
  ] = `String getBluetoothMessage() {
   if (bluetoothMessageDEV.length() > 0) {
     return bluetoothMessageDEV;
   }

   bluetoothMessageDEV = blueToothSerial.readStringUntil('|');

   return bluetoothMessageDEV;
};`;

  Blockly["Arduino"].setupCode_["bluetooth_setup"] =
    "\tblueToothSerial.begin(" +
    selectBoardBlockly().serial_baud_rate +
    "); \n" +
    "\tdelay(1000); \n";

  return "";
};

Blockly["Arduino"]["bluetooth_get_message"] = function (block) {
  return ["getBluetoothMessage()", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["bluetooth_has_message"] = function (block) {
  // available() returns the number of bytes.  Because 0 will return false
  // we can return 0 as false and greater than 0 as true for the blocks.
  return [
    "getBluetoothMessage().length() > 0",
    Blockly["Arduino"].ORDER_ATOMIC,
  ];
};

Blockly["Arduino"]["bluetooth_send_message"] = function (block) {
  const message = Blockly["Arduino"].valueToCode(
    block,
    "MESSAGE",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  return "blueToothSerial.println(" + message + ");\n";
};
