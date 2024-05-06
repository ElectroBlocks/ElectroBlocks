import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";

import {
  createArduinoAndWorkSpace,
  createValueBlock,
  createTestEvent,
} from "../../tests/tests.helper";
import type { Workspace, BlockSvg } from "blockly";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import { findComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import {
  ArduinoComponentType,
  ArduinoFrame,
} from "../../core/frames/arduino.frame";
import type { ServoState } from "./state";

describe("test servos factories", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  it("should be able to create different arduino", () => {
    const servo6Block1 = createServoBlock(20, ARDUINO_PINS.PIN_6);
    const servo6Block2 = createServoBlock(120, ARDUINO_PINS.PIN_6);
    const servo9Block1 = createServoBlock(29, ARDUINO_PINS.PIN_9);
    const servo9Block2 = createServoBlock(140, ARDUINO_PINS.PIN_9);

    connectToArduinoBlock(servo6Block1);
    servo6Block1.nextConnection.connect(servo9Block1.previousConnection);
    servo9Block1.nextConnection.connect(servo6Block2.previousConnection);
    servo6Block2.nextConnection.connect(servo9Block2.previousConnection);

    const event = createTestEvent(servo6Block1.id);

    const [state1, state2, state3, state4] = eventToFrameFactory(event).frames;

    expect(state1.explanation).toBe("Servo 6 is rotating to 20 degrees.");
    expect(state2.explanation).toBe("Servo 9 is rotating to 29 degrees.");
    expect(state3.explanation).toBe("Servo 6 is rotating to 120 degrees.");
    expect(state4.explanation).toBe("Servo 9 is rotating to 140 degrees.");

    const servo6State1 = findComponent<ServoState>(
      state1,
      ArduinoComponentType.SERVO,
      ARDUINO_PINS.PIN_6
    );
    expect(state1.components.length).toBe(1);
    expect(servo6State1.degree).toBe(20);

    verifyServos(state2, 20, 29);
    verifyServos(state3, 120, 29);
    verifyServos(state4, 120, 140);
  });

  const createServoBlock = (degree: number, pin: ARDUINO_PINS) => {
    const rotateServo = workspace.newBlock("rotate_servo") as BlockSvg;
    const numberBlock = createValueBlock(
      workspace,
      VariableTypes.NUMBER,
      degree
    );
    rotateServo.setFieldValue(pin, "PIN");
    rotateServo
      .getInput("DEGREE")
      .connection.connect(numberBlock.outputConnection);

    return rotateServo;
  };

  const verifyServos = (
    state: ArduinoFrame,
    servo6Degree: number,
    servo9Degree: number
  ) => {
    const servoState6 = findComponent<ServoState>(
      state,
      ArduinoComponentType.SERVO,
      ARDUINO_PINS.PIN_6
    );

    const servoState9 = findComponent<ServoState>(
      state,
      ArduinoComponentType.SERVO,
      ARDUINO_PINS.PIN_9
    );

    expect(servoState6.degree).toBe(servo6Degree);
    expect(servoState9.degree).toBe(servo9Degree);
    expect(state.components.length).toBe(2);
  };
});
