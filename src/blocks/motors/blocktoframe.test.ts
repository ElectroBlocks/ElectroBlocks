import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";

import type { Workspace, BlockSvg } from "blockly";
import {
  createArduinoAndWorkSpace,
  createValueBlock,
  createTestEvent,
} from "../../tests/tests.helper";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import {
  ArduinoFrame,
  ArduinoComponentType,
} from "../../core/frames/arduino.frame";
import type { MotorShieldState } from "./state";

describe("test motors factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  it("test stop motor block will stop the right motors", () => {
    const motorSetupBlock = workspace.newBlock("motor_setup");
    motorSetupBlock.setFieldValue("2", "NUMBER_OF_COMPONENTS");
    const motor1Block1 = createMoveMotorBlock(1, "CLOCKWISE", 50);
    const motor2Block2 = createMoveMotorBlock(2, "ANTI_CLOCKWISE", 150);
    const stopMotor1 = workspace.newBlock("stop_motor") as BlockSvg;
    const stopMotor2 = workspace.newBlock("stop_motor") as BlockSvg;
    stopMotor1.setFieldValue("1", "MOTOR");
    stopMotor2.setFieldValue("2", "MOTOR");
    connectToArduinoBlock(motor1Block1);
    motor1Block1.nextConnection.connect(motor2Block2.previousConnection);
    motor2Block2.nextConnection.connect(stopMotor1.previousConnection);
    stopMotor1.nextConnection.connect(stopMotor2.previousConnection);
    const event = createTestEvent(motor2Block2.id);

    const [stateSetup, state1, state2, state3, state4] =
      eventToFrameFactory(event).frames;

    expect("Stopping motor 1.").toBe(state3.explanation);
    VerifyMotorState(state3, 0, 150, "CLOCKWISE", "ANTI_CLOCKWISE");
    expect("Stopping motor 2.").toBe(state4.explanation);
    VerifyMotorState(state4, 0, 0, "CLOCKWISE", "ANTI_CLOCKWISE");
  });

  it("test it can do one two motors in different directions.", () => {
    const motorSetupBlock = workspace.newBlock("motor_setup");
    motorSetupBlock.setFieldValue("2", "NUMBER_OF_COMPONENTS");
    const motor1Block1 = createMoveMotorBlock(1, "CLOCKWISE", 50);
    const motor2Block2 = createMoveMotorBlock(2, "ANTI_CLOCKWISE", 150);

    const motor1Block3 = createMoveMotorBlock(1, "ANTI_CLOCKWISE", 32);
    const motor2Block4 = createMoveMotorBlock(2, "CLOCKWISE", 43);

    connectToArduinoBlock(motor1Block1);
    motor1Block1.nextConnection.connect(motor2Block2.previousConnection);
    motor2Block2.nextConnection.connect(motor1Block3.previousConnection);
    motor1Block3.nextConnection.connect(motor2Block4.previousConnection);

    const event = createTestEvent(motor2Block2.id);

    const [stateSetup, state1, state2, state3, state4] =
      eventToFrameFactory(event).frames;
    expect(state1.explanation).toBe("Motor 1 moves clockwise at speed 50.");
    expect(state2.explanation).toBe(
      "Motor 2 moves anticlockwise at speed 150."
    );
    expect(state3.explanation).toBe("Motor 1 moves anticlockwise at speed 32.");
    expect(state4.explanation).toBe("Motor 2 moves clockwise at speed 43.");

    const motorShield = state1.components.find(
      (c) => c.type === ArduinoComponentType.MOTOR
    ) as MotorShieldState;
    expect(motorShield.direction1).toBe("CLOCKWISE");
    expect(motorShield.speed1).toBe(50);

    VerifyMotorState(state2, 50, 150, "CLOCKWISE", "ANTI_CLOCKWISE");
    VerifyMotorState(state3, 32, 150, "ANTI_CLOCKWISE", "ANTI_CLOCKWISE");
    VerifyMotorState(state4, 32, 43, "ANTI_CLOCKWISE", "CLOCKWISE");
  });

  const createMoveMotorBlock = (
    motorNumber: number,
    direction: string,
    speed: number
  ) => {
    const numberBlock = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      speed
    );

    const motorBlock = workspace.newBlock("move_motor") as BlockSvg;

    motorBlock.setFieldValue(direction, "DIRECTION");
    motorBlock.setFieldValue(motorNumber.toString(), "MOTOR");
    motorBlock
      .getInput("SPEED")
      .connection.connect(numberBlock.outputConnection);

    return motorBlock;
  };

  const VerifyMotorState = (
    state: ArduinoFrame,
    motor1Speed: number,
    motor2Speed: number,
    motor1Direction: string,
    motor2Direction: string
  ) => {
    const motorShield = state.components.find(
      (c) => c.type === ArduinoComponentType.MOTOR
    ) as MotorShieldState;

    expect(motorShield.direction1).toBe(motor1Direction);
    expect(motorShield.direction2).toBe(motor2Direction);

    expect(motorShield.speed1).toBe(motor1Speed);
    expect(motorShield.speed2).toBe(motor2Speed);

    expect(state.components.length).toBe(1);
  };
});
