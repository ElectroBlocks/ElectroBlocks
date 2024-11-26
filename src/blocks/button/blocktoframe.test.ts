import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../tests/tests.helper";
import { saveSensorSetupBlockData } from "../../core/blockly/actions/saveSensorSetupBlockData";
import { updater } from "../../core/blockly/updater";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import {
  ArduinoComponentType,
  ArduinoFrame,
} from "../../core/frames/arduino.frame";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import type { ButtonState } from "./state";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";

describe("button state factories", () => {
  let workspace: Workspace;
  let buttonSetup;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    buttonSetup = workspace.newBlock("button_setup") as BlockSvg;
    buttonSetup.setFieldValue("3", "PIN");
    buttonSetup.setFieldValue(true, "is_pressed");

    const event = createTestEvent(buttonSetup.id);
    saveSensorSetupBlockData(event).forEach(updater);
  });

  it("should be able to release button after it has been pressed in the loop", () => {
    const buttonStateFrame1: ButtonState = {
      isPressed: false,
      pins: [ARDUINO_PINS.PIN_3],
      type: ArduinoComponentType.BUTTON,
      usePullup: false,
    };
    const releaseButton1 = workspace.newBlock("release_button") as BlockSvg;
    releaseButton1.setFieldValue("RELEASED", "STATE");
    const releaseButton2 = workspace.newBlock("release_button") as BlockSvg;
    releaseButton2.setFieldValue("PRESSED", "STATE");

    const expectedReleaseState1: ArduinoFrame = {
      blockId: releaseButton1.id,
      blockName: "release_button",
      timeLine: { function: "loop", iteration: 1 },
      explanation: "Button 3 is being released.",
      components: [buttonStateFrame1],
      variables: {},
      txLedOn: false,
      builtInLedOn: false,
      sendMessage: "", // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true,
      frameNumber: 2,
    };
    const buttonStateFrame2: ButtonState = {
      isPressed: true,
      pins: [ARDUINO_PINS.PIN_3],
      type: ArduinoComponentType.BUTTON,
      usePullup: false,
    };
    const expectedReleaseState2: ArduinoFrame = {
      blockId: releaseButton2.id,
      blockName: "release_button",
      timeLine: { function: "loop", iteration: 1 },
      explanation: "Button 3 is being pressed.",
      components: [buttonStateFrame2],
      variables: {},
      txLedOn: false,
      builtInLedOn: false,
      sendMessage: "", // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true,
      frameNumber: 3,
    };

    connectToArduinoBlock(releaseButton2);
    connectToArduinoBlock(releaseButton1);

    const event = createTestEvent(releaseButton1.id);
    expect(eventToFrameFactory(event).frames[1]).toEqual(expectedReleaseState1);
    expect(eventToFrameFactory(event).frames[2]).toEqual(expectedReleaseState2);
  });

  it("should be able generate state for button setup block", () => {
    const event = createTestEvent(buttonSetup.id);

    const buttonState: ButtonState = {
      isPressed: true,
      pins: [ARDUINO_PINS.PIN_3],
      type: ArduinoComponentType.BUTTON,
      usePullup: false,
    };

    const state: ArduinoFrame = {
      blockId: buttonSetup.id,
      blockName: "button_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "Button 3 is being setup.",
      components: [buttonState],
      variables: {},
      txLedOn: false,
      builtInLedOn: false,
      sendMessage: "", // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true,
      frameNumber: 1,
    };

    expect(eventToFrameFactory(event).frames).toEqual([state]);
  });
});
