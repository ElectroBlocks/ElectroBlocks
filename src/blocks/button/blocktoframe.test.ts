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
    const buttonState: ButtonState = {
      isPressed: false,
      pins: [ARDUINO_PINS.PIN_3],
      type: ArduinoComponentType.BUTTON,
    };
    const releaseButton = workspace.newBlock("release_button") as BlockSvg;

    const expectedReleaseState: ArduinoFrame = {
      blockId: releaseButton.id,
      blockName: "release_button",
      timeLine: { function: "loop", iteration: 1 },
      explanation: "Button 3 is being released.",
      components: [buttonState],
      variables: {},
      txLedOn: false,
      builtInLedOn: false,
      sendMessage: "", // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true,
      frameNumber: 2,
    };

    connectToArduinoBlock(releaseButton);
    const event = createTestEvent(releaseButton.id);
    expect(eventToFrameFactory(event).frames[1]).toEqual(expectedReleaseState);
  });

  it("should be able generate state for button setup block", () => {
    const event = createTestEvent(buttonSetup.id);

    const buttonState: ButtonState = {
      isPressed: true,
      pins: [ARDUINO_PINS.PIN_3],
      type: ArduinoComponentType.BUTTON,
    };

    const state: ArduinoFrame = {
      blockId: buttonSetup.id,
      blockName: "button_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "button 3 is being setup.",
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
