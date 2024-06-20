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
import type { MotorState } from "./state";

describe("test servos factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  it("test it can do one two motors in different directions.", () => {
    const motor1Block1 = createMotorBlock(1, "CLOCKWISE", 50);
    const motor2Block2 = createMotorBlock(2, "ANTICLOCKWISE", 150);

    const motor1Block3 = createMotorBlock(1, "ANTICLOCKWISE", 32);
    const motor2Block4 = createMotorBlock(2, "CLOCKWISE", 43);

    connectToArduinoBlock(motor1Block1);
    motor1Block1.nextConnection.connect(motor2Block2.previousConnection);
    motor2Block2.nextConnection.connect(motor1Block3.previousConnection);
    motor1Block3.nextConnection.connect(motor2Block4.previousConnection);

    const event = createTestEvent(motor2Block2.id);

    const [state1, state2, state3, state4] = eventToFrameFactory(event).frames;

    expect(state1.explanation).toBe("Motor 1 moves clockwise at speed 50.");
    expect(state2.explanation).toBe("Motor 2 moves anticlockwise at speed 150.");
    expect(state3.explanation).toBe("Motor 1 moves anticlockwise at speed 32.");
    expect(state4.explanation).toBe("Motor 2 moves clockwise at speed 43.");

    const motor1 = state1.components.find(
      (c) =>
        c.type === ArduinoComponentType.MOTOR &&
        parseInt((c as MotorState).motorNumber) === 1
    ) as MotorState;
    expect(motor1.direction).toBe("CLOCKWISE");
    expect(motor1.speed).toBe(50);
    expect(parseInt(motor1.motorNumber)).toBe(1);

    verifyMotorServos(state2, 50, 150, "CLOCKWISE", "ANTICLOCKWISE");
    verifyMotorServos(state3, 32, 150, "ANTICLOCKWISE", "ANTICLOCKWISE");
    verifyMotorServos(state4, 32, 43, "ANTICLOCKWISE", "CLOCKWISE");
  });

  const createMotorBlock = (
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
    motorBlock
      .setFieldValue(motorNumber.toString(), "MOTOR");
    motorBlock
      .getInput("SPEED")
      .connection.connect(numberBlock.outputConnection);

    return motorBlock;
  };

  const verifyMotorServos = (
    state: ArduinoFrame,
    motor1Speed: number,
    motor2Speed: number,
    motor1Direction: string,
    motor2Direction: string
  ) => {
    const motor1 = state.components.find(
      (c) =>
        c.type === ArduinoComponentType.MOTOR &&
        parseInt((c as MotorState).motorNumber) === 1
    ) as MotorState;

    const motor2 = state.components.find(
      (c) =>
        c.type === ArduinoComponentType.MOTOR &&
        parseInt((c as MotorState).motorNumber) === 2
    ) as MotorState;

    expect(motor1.direction).toBe(motor1Direction);
    expect(motor2.direction).toBe(motor2Direction);

    expect(motor1.speed).toBe(motor1Speed);
    expect(motor2.speed).toBe(motor2Speed);

    expect(state.components.length).toBe(2);
  };
});
