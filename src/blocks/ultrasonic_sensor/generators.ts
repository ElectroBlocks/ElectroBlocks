import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["ultra_sonic_sensor_motion"] = function (block: Block) {
  return ["ultraSonicDistance()", Blockly["Arduino"].ORDER_ATOMIC];
};

Blockly["Arduino"]["ultra_sonic_sensor_setup"] = function (block: Block) {
  const echoPin = block.getFieldValue("PIN_ECHO");
  const trigPin = block.getFieldValue("PIN_TRIG");

  Blockly["Arduino"].setupCode_[
    "setup_input_" + echoPin
  ] = `   pinMode(${echoPin}, INPUT); // Set pin ${echoPin} as input for the echo signal \n`;
  Blockly["Arduino"].setupCode_[
    "setup_input_" + trigPin
  ] = `   pinMode(${trigPin}, OUTPUT); // Set pin ${trigPin} as output for the trigger signal \n`;
  Blockly["Arduino"].functionNames_[
    "pulse_in_function"
  ] = `// This is function to Trigger the ultrasonic sensor and measure the distance
double ultraSonicDistance() {
  digitalWrite(${trigPin}, LOW); // Set the trigger pin to low
  delayMicroseconds(2); // Wait for 2 microseconds
  digitalWrite(${trigPin}, HIGH); // set the trigger pin to high
  delayMicroseconds(10); // Wait for 10 microseconds
  digitalWrite(${trigPin}, LOW); // Set the trigger pin to low
  long microseconds = pulseIn(${echoPin}, HIGH); // Measure the time for the echo to retur
  return (double)(microseconds / 29 / 2);  // Convert the time to distance in cm
}`;

  return "";
};
