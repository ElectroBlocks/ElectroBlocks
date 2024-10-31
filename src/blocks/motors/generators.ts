import Blockly from "blockly";
import type { Block } from "blockly";

Blockly["Arduino"]["motor_setup"] = function (block) {
  const numberOfMotors = +block.getFieldValue("NUMBER_OF_MOTORS");
  const pinEn1 = block.getFieldValue("PIN_EN1");
  const pinIn1 = block.getFieldValue("PIN_IN1");
  const pinIn2 = block.getFieldValue("PIN_IN2");
  const pinEn2 = block.getFieldValue("PIN_EN2");
  const pinIn3 = block.getFieldValue("PIN_IN3");
  const pinIn4 = block.getFieldValue("PIN_IN4");

  let motorSetupStart = `typedef enum {
  CLOCKWISE = 0,
  ANTI_CLOCKWISE = 1,
  STOP = -1
} Direction;
`;

  motorSetupStart += `
const int motor1Pin1 = ${pinIn1};
const int motor1Pin2 = ${pinIn2};
const int enablePin1 = ${pinEn1};`;
  Blockly["Arduino"].setupCode_["motor_setup"] = `
  pinMode(motor1Pin1, OUTPUT);
  pinMode(motor1Pin2, OUTPUT);
  pinMode(enablePin1, OUTPUT);
`;

  if (numberOfMotors === 2) {
    motorSetupStart += `
const int motor2Pin1 = ${pinIn3};
const int motor2Pin2 = ${pinIn4};
const int enablePin2 = ${pinEn2};`;
    Blockly["Arduino"].setupCode_["motor_setup"] = `
  pinMode(motor1Pin1, OUTPUT);
  pinMode(motor1Pin2, OUTPUT);
  pinMode(enablePin1, OUTPUT);
  pinMode(motor2Pin1, OUTPUT);
  pinMode(motor2Pin2, OUTPUT);
  pinMode(enablePin2, OUTPUT);
`;
  }

  motorSetupStart += `

void moveMotor(int motor, int speed, Direction direction) {
  int enablePin = ${
    numberOfMotors === 1 ? "enablePin1" : "motor == 1 ? enablePin1 : enablePin2"
  };
  int pin1 = ${
    numberOfMotors === 1
      ? "motor1Pin1;"
      : "motor == 1 ? motor1Pin1 : motor2Pin1;"
  } 
  int pin2 = ${
    numberOfMotors === 1
      ? "motor1Pin2;"
      : "motor == 1 ? motor1Pin2 : motor2Pin2;"
  } 
  if (speed > 255) {
    speed = 254;
  } else if (speed < 1) {
    speed = 1;
  }

  switch (direction) {
    case CLOCKWISE:
      digitalWrite(pin1, HIGH);
      digitalWrite(pin2, LOW);
      analogWrite(enablePin, speed);
      break;
    case ANTI_CLOCKWISE:
      digitalWrite(pin1, LOW);
      digitalWrite(pin2, HIGH);
      analogWrite(enablePin, speed);
      break;
    case STOP:
      analogWrite(enablePin, 0);
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
