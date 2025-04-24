import Blockly from "blockly";
import { selectBoardBlockly } from "../../core/microcontroller/selectBoard";

export function stepSerialBegin() {
  Blockly["Arduino"].setupCode_["serial_begin"] =
    "   Serial.begin(" +
    selectBoardBlockly().serial_baud_rate +
    "); \n" +
    "   Serial.setTimeout(10);\n";
}

function import_libs() {
  Blockly["Python"].imports_["import_pyfirmata"] = "from pyfirmata import Arduino, util";
  Blockly["Python"].imports_["import_time"] = "import time";
  Blockly["Python"].imports_["import_serial"] = "import serial";  
}

export function stepSerialBeginPy() {
  import_libs();

  if (!Blockly["Python"].setupCode_["serial_begin"]) {
    Blockly["Python"].setupCode_["serial_begin"] =
      "# Connect to the Arduino Board (pyFirmata)\n" +
      "board = Arduino('REPLACE_WITH_YOUR_PORT')  # Update port if needed\n" +
      "\n" +
      "# Start iterator for pin reading\n" +
      "it = util.Iterator(board)\n" +
      "it.start()\n" +
      "\n" +
      "# Set up serial for messaging\n" +
      "ser = serial.Serial('REPLACE_WITH_YOUR_PORT', 9600, timeout=1)\n" +
      "serialMessageDEV = ''\n";
  }

  // Define setSerialMessage
  Blockly["Python"].functionNames_["setSerialMessage"] =
    "# Read a line from serial if available\n" +
    "def setSerialMessage():\n" +
    "    global serialMessageDEV\n" +
    "    serialMessageDEV = ''\n" +
    "    if ser.in_waiting > 0:\n" +
    "        serialMessageDEV = ser.readline().decode().strip()\n";

  // Add wrapper functions that call setSerialMessage first
  Blockly["Python"].functionNames_["getSerialMessage"] =
    "# Wrapper: update then return message\n" +
    "def getSerialMessage():\n" +
    "    setSerialMessage()\n" +
    "    return serialMessageDEV\n";

  Blockly["Python"].functionNames_["hasSerialMessage"] =
    "# Wrapper: update then check availability\n" +
    "def hasSerialMessage():\n" +
    "    setSerialMessage()\n" +
    "    return len(serialMessageDEV) > 0\n";
}

Blockly["Arduino"]["message_setup"] = function () {
  stepSerialBegin();
  return "";
};

Blockly["Python"]["message_setup"] = function () {
  stepSerialBeginPy();
  return "";
};

// Arduino generators unchanged
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

// Python generators now call the wrappers
Blockly["Python"]["arduino_get_message"] = function (block) {
  Blockly["Python"].information_["message_recieve_block"] = true;
  return ["getSerialMessage()", Blockly["Python"].ORDER_ATOMIC];
};

Blockly["Python"]["arduino_receive_message"] = function (block) {
  Blockly["Python"].information_["message_recieve_block"] = true;
  return ["hasSerialMessage()", Blockly["Python"].ORDER_ATOMIC];
};

Blockly["Python"]["arduino_send_message"] = function (block) {
  const message = Blockly["Python"].valueToCode(
    block,
    "MESSAGE",
    Blockly["Python"].ORDER_ATOMIC
  );

  return (
    "ser.write((" +
    message +
    ").encode())\n" +
    "time.sleep(0.2)\n"
  );
};

