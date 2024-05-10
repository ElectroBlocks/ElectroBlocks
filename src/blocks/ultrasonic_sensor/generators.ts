import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["ultra_sonic_sensor_motion"] = function (block: Block) {
  return ["ultraSonicDistance()", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["ultra_sonic_sensor_setup"] = function (block: Block) {
  const echoPin = block.getFieldValue("PIN_ECHO");
  const trigPin = block.getFieldValue("PIN_TRIG");

  Blockly["Arduino"].setupCode_["setup_input_" + echoPin] =
    "\tpinMode(" + echoPin + ", INPUT);\n";
  Blockly["Arduino"].setupCode_["setup_input_" + trigPin] =
    "\tpinMode(" + trigPin + ", OUTPUT);\n";
  Blockly["Arduino"].functionNames_["pulse_in_function"] =
    "double ultraSonicDistance() { \n" +
    `\tdigitalWrite(${trigPin}, LOW);\n` +
    "\tdelayMicroseconds(2); \n" +
    `\tdigitalWrite(${trigPin}, HIGH); \n` +
    "\tdelayMicroseconds(10); \n" +
    `\tdigitalWrite(${trigPin}, LOW); \n` +
    `\tlong microseconds = pulseIn(${echoPin}, HIGH); \n` +
    "\treturn (double)(microseconds / 29 / 2); \n" +
    "} \n\n";

  return "";
};
