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

import Blockly from "blockly";
import type { Block } from "blockly";

Blockly.Python["ultra_sonic_sensor_motion"] = function (block: Block) {
  return ["ultra_sonic_distance()", Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["ultra_sonic_sensor_setup"] = function (block: Block) {
  const echoPin = block.getFieldValue("PIN_ECHO");
  const trigPin = block.getFieldValue("PIN_TRIG");

  Blockly.Python.definitions_ = Blockly.Python.definitions_ || {};
  Blockly.Python.setups_ = Blockly.Python.setups_ || {};

  Blockly.Python.definitions_["import_pyfirmata"] = `
from pyfirmata import Arduino, util
import time
board = Arduino('/dev/ttyACM0')  # Change this to your correct port
`;

  Blockly.Python.setups_["start_iterator"] = `
it = util.Iterator(board)
it.start()
board.digital[${echoPin}].mode = util.INPUT
board.digital[${trigPin}].mode = util.OUTPUT
`;

  Blockly.Python.definitions_["ultrasonic_function"] = `
def ultra_sonic_distance():
    board.digital[${trigPin}].write(0)
    time.sleep(0.000002)
    board.digital[${trigPin}].write(1)
    time.sleep(0.00001)
    board.digital[${trigPin}].write(0)

    # Wait for HIGH
    while board.digital[${echoPin}].read() == 0:
        pulse_start = time.time()
    while board.digital[${echoPin}].read() == 1:
        pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start
    return round(pulse_duration / 29 / 2, 2)
`;

  return "";
};
