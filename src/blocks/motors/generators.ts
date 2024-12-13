import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["motor_setup"] = function (block) {
  const numberOfMotors = +block.getFieldValue("NUMBER_OF_COMPONENTS");
  const pinEn1 = block.getFieldValue("PIN_EN1");
  const pinIn1 = block.getFieldValue("PIN_IN1");
  const pinIn2 = block.getFieldValue("PIN_IN2");
  const pinEn2 = block.getFieldValue("PIN_EN2");
  const pinIn3 = block.getFieldValue("PIN_IN3");
  const pinIn4 = block.getFieldValue("PIN_IN4");

  let motorSetupStart = `
// Define an enumeration for motor direction with three possible values
typedef enum {
  CLOCKWISE = 0, // Motor turns in the clockwise direction
  ANTI_CLOCKWISE = 1,  // Motor turns in the anti-clockwise direction
  STOP = -1 // Motor stops
} Direction;
`;

  motorSetupStart += `
// Pin assign for the motor control
const int motor1Pin1 = ${pinIn1};  // Control pin for motor direction 1
const int motor1Pin2 = ${pinIn2};  // Control pin for motor direction 2
const int enablePin1 = ${pinEn1}; // PWM pin to enable the motor1`;
  Blockly["Arduino"].setupCode_["motor_setup"] = `
   // Configuring motor control pins
   pinMode(motor1Pin1, OUTPUT); // Set motor1Pin1 as output
   pinMode(motor1Pin2, OUTPUT);  // Set motor1Pin2 as output
   pinMode(enablePin1, OUTPUT);  // Set enablePin1 as output
   // Motor pin setup complete
`;

  if (numberOfMotors === 2) {
    motorSetupStart += `
const int motor2Pin1 = ${pinIn3}; // Control pin for motor2 direction 1
const int motor2Pin2 = ${pinIn4}; // Control pin for motor2 direction 2
const int enablePin2 = ${pinEn2}; // PWM pin to enable the motor2`;
    Blockly["Arduino"].setupCode_["motor_setup"] = `
   // Configuring motor control pins
   pinMode(motor1Pin1, OUTPUT); // Set motor1Pin1 as output
   pinMode(motor1Pin2, OUTPUT); // Set motor1Pin2 as output
   pinMode(enablePin1, OUTPUT); // Set enablePin1 as output
   pinMode(motor2Pin1, OUTPUT); // Set motor2Pin1 as output
   pinMode(motor2Pin2, OUTPUT); // Set motor2Pin2 as output
   pinMode(enablePin2, OUTPUT); // Set enablePin2 as output
   // Motor pin setup complete
`;
  }

  motorSetupStart += `

// Function to move the motor based on specified speed and direction
void moveMotor(int motor, int speed, Direction direction) {
  int enablePin = ${
    numberOfMotors === 1 ? "enablePin1" : "motor == 1 ? enablePin1 : enablePin2"
  }; // Set the enable pin to enablePin1
  int pin1 = ${
    numberOfMotors === 1 ? "motor1Pin1" : "motor == 1 ? motor1Pin1 : motor2Pin1"
  }; // Set pin1 to control direction 1
  int pin2 = ${
    numberOfMotors === 1 ? "motor1Pin2" : "motor == 1 ? motor1Pin2 : motor2Pin2"
  }; // Set pin2 to control direction 2
  // Control the motor direction based on the specified direction
  if (speed > 255) {
    speed = 254;
  } else if (speed < 1) {
    speed = 1;
  }

  switch (direction) {
    case CLOCKWISE:
      digitalWrite(pin1, HIGH);  // Set pin1 high to turn clockwise
      digitalWrite(pin2, LOW); // Set pin2 low
      analogWrite(enablePin, speed);  // Set motor speed
      break;
    case ANTI_CLOCKWISE:
      digitalWrite(pin1, LOW); // Set pin1 low to turn anti-clockwise
      digitalWrite(pin2, HIGH); // Set pin2 high
      analogWrite(enablePin, speed); // Set motor speed
      break;
    case STOP:
      analogWrite(enablePin, 0);  // Stop the motor
      break;
  }
}
`;

  Blockly["Arduino"].libraries_["motor_setup"] = motorSetupStart;

  return "";
};
Blockly["Arduino"]["stop_motor"] = function (block: Block) {
  const motorNumber = block.getFieldValue("MOTOR");
  return `moveMotor(${motorNumber}, 0, STOP);\n`;
};
Blockly["Arduino"]["move_motor"] = function (block: Block) {
  const motorNumber = block.getFieldValue("MOTOR");
  const speed = Blockly["Arduino"].valueToCode(
    block,
    "SPEED",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  const direction = block.getFieldValue("DIRECTION").toUpperCase();

  return `moveMotor(${motorNumber}, ${speed}, ${direction});\n`;
};
