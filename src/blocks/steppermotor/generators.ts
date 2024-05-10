import Blockly, { type Block } from "blockly";

Blockly["Arduino"]["stepper_motor_setup"] = function (block: Block) {
  const totalSteps = block.getFieldValue("TOTAL_STEPS");
  const speed = block.getFieldValue("SPEED");

  const pin1 = block.getFieldValue("PIN_1");
  const pin2 = block.getFieldValue("PIN_2");
  const pin3 = block.getFieldValue("PIN_3");
  const pin4 = block.getFieldValue("PIN_4");
  Blockly["Arduino"].libraries_["stepper_motor"] = `
#include <Stepper.h>
const int stepsPerRevolution = ${totalSteps};

Stepper stepperMotor(stepsPerRevolution, ${pin1}, ${pin2}, ${pin3}, ${pin4});

  `;
  Blockly["Arduino"].setupCode_[
    "stepper_motor_set_speed"
  ] = `stepperMotor.setSpeed(${speed});`;

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
