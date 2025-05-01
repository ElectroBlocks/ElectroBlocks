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

Blockly.Python["ultra_sonic_sensor_motion"] = function (block: Block) {
  return ["ultra_sonic_distance()", Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python["ultra_sonic_sensor_setup"] = function (block: Block) {
  const echoPin = block.getFieldValue("PIN_ECHO");
  const trigPin = block.getFieldValue("PIN_TRIG");

  Blockly.Python.definitions_ = Blockly.Python.definitions_ || {};
  Blockly.Python.setups_ = Blockly.Python.setups_ || {};

  Blockly.Python.definitions_["import_gpio"] = "import RPi.GPIO as GPIO";
  Blockly.Python.definitions_["import_time"] = "import time";

  Blockly.Python.setups_["gpio_mode"] = "GPIO.setmode(GPIO.BCM)";
  Blockly.Python.setups_["setup_echo_pin"] = `GPIO.setup(${echoPin}, GPIO.IN)`;
  Blockly.Python.setups_["setup_trig_pin"] = `GPIO.setup(${trigPin}, GPIO.OUT)`;

  Blockly.Python.definitions_["ultrasonic_function"] = `
def ultra_sonic_distance():
    GPIO.output(${trigPin}, GPIO.LOW)
    time.sleep(0.000002)
    GPIO.output(${trigPin}, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(${trigPin}, GPIO.LOW)

    while GPIO.input(${echoPin}) == 0:
        pulse_start = time.time()
    while GPIO.input(${echoPin}) == 1:
        pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150
    return round(distance, 2)
`;

  return "";
};
