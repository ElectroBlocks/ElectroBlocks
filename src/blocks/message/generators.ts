import Blockly from "blockly";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";

export function stepSerialBegin() {
  Blockly["Arduino"].setupCode_["serial_begin"] =
    "\tSerial.begin(" +
    selectBoardBlockly().serial_baud_rate +
    "); \n" +
    "\tSerial.setTimeout(10);\n";

  Blockly["Arduino"].setupCode_["debug_clean_pipes"] =
    "\tdelay(200); // to prevent noise after uploading code \n";

  Blockly["Arduino"].setupCode_[
    "debug_wait_til_ok"
  ] = `while(Serial.readStringUntil('|').indexOf("START_DEBUG") == -1) {
      Serial.println("C_D_B_C_D_B_C_D_B_C_D_B_C_D_B_");
      delay(100);
  }\n\n`;
}

Blockly["Arduino"]["message_setup"] = function () {
  stepSerialBegin();
  Blockly["Arduino"].functionNames_[
    "setSerialMessage"
  ] = `void setSerialMessage() {
  if (Serial.available() > 0) {
      serialMessageDEV = Serial.readString();
      serialMessageDEV.trim();      
  }
};
  `;
  return "";
};

Blockly["Arduino"]["arduino_get_message"] = function (block) {
  return ["serialMessageDEV", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["arduino_receive_message"] = function (block) {
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
