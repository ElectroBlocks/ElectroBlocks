import Blockly from "blockly";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";

export function stepSerialBegin() {
  Blockly["Arduino"].setupCode_["serial_begin"] =
    "   Serial.begin(" +
    selectBoardBlockly().serial_baud_rate +
    "); \n" +
    "   Serial.setTimeout(100);\n";
}
Blockly["Python"]["message_setup"] = () => "";
Blockly["Arduino"]["message_setup"] = function () {
  stepSerialBegin();

  return "";
};

Blockly["Python"]["arduino_get_message"] = function (block) {
  return "";
};

Blockly["Arduino"]["arduino_get_message"] = function (block) {
  Blockly["Arduino"].information_["message_recieve_block"] = true;

  Blockly["Arduino"].functionNames_[
    "setSerialMessage"
  ] = `void setSerialMessage() {
  if (Serial.available() > 0) {
      serialMessageDEV = Serial.readStringUntil('|');
      serialMessageDEV.trim();      
  }
};
  `;
  return ["serialMessageDEV", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Python"]["arduino_receive_message"] = () => [
  "",
  Blockly["Arduino"].ORDER_ATOMIC,
];

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
Blockly["Python"]["arduino_send_message"] = () => "";

Blockly["Arduino"]["arduino_send_message"] = function (block) {
  const message = Blockly["Arduino"].valueToCode(
    block,
    "MESSAGE",
    Blockly["Arduino"].ORDER_ATOMIC
  );

  return (
    "Serial.println(" +
    message +
    ");\n" +
    "Serial.flush(); // Waits until outgoing buffer is empty \n"
  );
};
