import { BlockSvg, Workspace } from "blockly";
import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import {
  ArduinoComponentType,
  ArduinoFrame,
} from "../../core/frames/arduino.frame";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import "../../tests/fake-block";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
  createValueBlock,
} from "../../tests/tests.helper";
import { PassiveBuzzerState, NOTE_TONES } from "./state";

describe("Passive Buzzer Tests", () => {
  let workspace: Workspace;
  let passivebuzzer: BlockSvg;
  let arduinoBlock: BlockSvg;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue("1", "LOOP_TIMES");
  });

  it("should be able to do one passive buzzer and it on and off", () => {
    const block1 = workspace.newBlock("passive_buzzer_tone") as BlockSvg;
    block1.setFieldValue(ARDUINO_PINS.PIN_3, "PIN");
    const numBlock = createValueBlock(workspace, VariableTypes.NUMBER, 33);
    block1.getInput("TONE").connection.connect(numBlock.outputConnection);

    const block2 = createPassiveBuzzerBlock(
      NOTE_TONES.NO_TONE,
      ARDUINO_PINS.PIN_3,
      workspace
    );

    const block3 = createPassiveBuzzerBlock(
      NOTE_TONES.C,
      ARDUINO_PINS.PIN_3,
      workspace
    );

    connectToArduinoBlock(block3);
    connectToArduinoBlock(block2);
    connectToArduinoBlock(block1);

    const event = createTestEvent(block1.id);

    const frames = eventToFrameFactory(event).frames;
    expect(frames.length).toBe(3);
    console.log(
      frames.map((f) => f.components[0]),
      "frames"
    );
    verifySingleComponentFrame(frames[0], 33, ARDUINO_PINS.PIN_3);
    verifySingleComponentFrame(frames[1], 0, ARDUINO_PINS.PIN_3);
    verifySingleComponentFrame(frames[2], NOTE_TONES.C, ARDUINO_PINS.PIN_3);
  });

  it("should be able to do multiple buzzer and change their sound", () => {
    const block1 = createPassiveBuzzerBlock(
      NOTE_TONES["A#"],
      ARDUINO_PINS.PIN_4,
      workspace
    );

    const block2 = createPassiveBuzzerBlock(
      NOTE_TONES.B,
      ARDUINO_PINS.PIN_3,
      workspace
    );

    const block3 = createPassiveBuzzerBlock(
      NOTE_TONES.NO_TONE,
      ARDUINO_PINS.PIN_4,
      workspace
    );

    connectToArduinoBlock(block3);
    connectToArduinoBlock(block2);
    connectToArduinoBlock(block1);

    const event = createTestEvent(block1.id);

    const frames = eventToFrameFactory(event).frames;
    expect(frames.length).toBe(3);

    verifySingleComponentFrame(frames[0], NOTE_TONES["A#"], ARDUINO_PINS.PIN_4);

    const frame2 = frames[1];
    expect(frame2.components.length).toBe(2);
    const componentFrame2Pin4 = frame2.components.find(
      (c) => c.pins[0] === ARDUINO_PINS.PIN_4
    ) as PassiveBuzzerState;
    const componentFrame2Pin3 = frame2.components.find(
      (c) => c.pins[0] === ARDUINO_PINS.PIN_3
    ) as PassiveBuzzerState;

    verifyComponent(componentFrame2Pin4, ARDUINO_PINS.PIN_4, NOTE_TONES["A#"]);
    verifyComponent(componentFrame2Pin3, ARDUINO_PINS.PIN_3, NOTE_TONES.B);

    const frame3 = frames[2];
    expect(frame3.components.length).toBe(2);
    const componentFrame3Pin4 = frame3.components.find(
      (c) => c.pins[0] === ARDUINO_PINS.PIN_4
    ) as PassiveBuzzerState;
    const componentFrame3Pin3 = frame3.components.find(
      (c) => c.pins[0] === ARDUINO_PINS.PIN_3
    ) as PassiveBuzzerState;

    verifyComponent(
      componentFrame3Pin4,
      ARDUINO_PINS.PIN_4,
      NOTE_TONES.NO_TONE
    );
    verifyComponent(componentFrame3Pin3, ARDUINO_PINS.PIN_3, NOTE_TONES.B);
  });
});

function createPassiveBuzzerBlock(
  tone: NOTE_TONES,
  pin: ARDUINO_PINS,
  workspace: Workspace
) {
  const block = workspace.newBlock("passive_buzzer_note");

  block.setFieldValue(pin, "PIN");
  block.setFieldValue(tone.toString(), "TONE");

  return block as BlockSvg;
}

function verifySingleComponentFrame(
  frame: ArduinoFrame,
  tone: number,
  pin: ARDUINO_PINS
) {
  if (tone !== 0) {
    expect(frame.explanation).toBe(
      `Setting passive buzzer ${pin} tone to ${tone}.`
    );
  } else {
    expect(frame.explanation).toBe(`Turning off passive buzzer ${pin}.`);
  }

  expect(frame.components.length).toBe(1);
  const component = frame.components[0] as PassiveBuzzerState;
  verifyComponent(component, pin, tone);
}

function verifyComponent(
  component: PassiveBuzzerState,
  pin: ARDUINO_PINS,
  tone: number
) {
  expect(component.type).toBe(ArduinoComponentType.PASSIVE_BUZZER);
  expect(component.pins).toEqual([pin]);
  expect(component.tone).toBe(tone);
}
