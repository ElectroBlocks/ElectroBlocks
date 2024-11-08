import Blockly from "blockly";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";

export function stepSerialBegin() {
  Blockly["Arduino"].setupCode_["serial_begin"] =
    "\tSerial.begin(" +
    selectBoardBlockly().serial_baud_rate +
    "); \n" +
    "\tSerial.setTimeout(10);\n";
}

Blockly["Arduino"]["message_setup"] = function () {
  stepSerialBegin();

  return "";
};

Blockly["Arduino"]["arduino_get_message"] = function (block) {
  Blockly["Arduino"].information_["message_recieve_block"] = true;

  Blockly["Arduino"].functionNames_[
    "setSerialMessage"
  ] = `void setSerialMessage() {
  if (Serial.available() > 0) {
      serialMessageDEV = Serial.readString();
      serialMessageDEV.trim();      
  }
};
  `;
  return ["serialMessageDEV", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["arduino_receive_message"] = function (block) {
  Blockly["Arduino"].information_["message_recieve_block"] = true;
  Blockly["Arduino"].functionNames_[
    "setSerialMessage"
  ] = `void setSerialMessage() {
  if (Serial.available() > 0) {
      serialMessageDEV = Serial.readString();
      serialMessageDEV.trim();      
  }
};
  `;
  return ["(serialMessageDEV.length() > 0)", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["arduino_send_message"] = function (block) {
  const message = Blockly["Arduino"].valueToCode(
    block,
    "MESSAGE",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  return (
    "\tSerial.println(" +
    message +
    ");\n" +
    "\tdelay(200); // must have some delay always \n"
  );
};
