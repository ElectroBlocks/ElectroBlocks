import Blockly, { type Block } from "blockly";

Blockly["Arduino"]["stepper_motor_setup"] = function (block: Block) {
  const totalSteps = block.getFieldValue("TOTAL_STEPS");
  const speed = block.getFieldValue("SPEED");

  const pin1 = block.getFieldValue("PIN_1");
  const pin2 = block.getFieldValue("PIN_2");
  const pin3 = block.getFieldValue("PIN_3");
  const pin4 = block.getFieldValue("PIN_4");
  Blockly["Arduino"].libraries_["stepper_motor"] = `
// Include the Stepper library for controlling stepper motors
#include <Stepper.h>
// Define the number of steps per revolution for the stepper motor
const int stepsPerRevolution = ${totalSteps};
// Initialize the stepper motor with the number of steps per revolution 
// and the defined/given control pins
Stepper stepperMotor(stepsPerRevolution, ${pin1}, ${pin2}, ${pin3}, ${pin4});
  `;
  Blockly["Arduino"].setupCode_[
    "stepper_motor_set_speed"
  ] = `   // Set the speed of the stepper motor to defined/given speed in RPM.
   stepperMotor.setSpeed(${speed});\n`;

  return "";
};

Blockly["Arduino"]["stepper_motor_move"] = function (block: Block) {
  const steps = Blockly["Arduino"].valueToCode(
    block,
    "STEPS",
    Blockly["Arduino"].ORDER_ATOMIC
  );
  return `stepperMotor.step(${steps}); \n`;
};
