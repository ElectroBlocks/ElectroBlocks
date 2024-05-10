import type { BlockSvg, Workspace } from "blockly";
import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
  createValueBlock,
} from "../../tests/tests.helper";
import type { LedState } from "./state";

describe("test leds", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;
  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });
  afterEach(() => {
    workspace.dispose();
  });

  it("should not create 1 leds if they share the same pin", () => {
    const ledBlock1 = workspace.newBlock("led");
    ledBlock1.setFieldValue("3", "PIN");
    ledBlock1.setFieldValue("ON", "STATE");

    const ledBlock2 = workspace.newBlock("led");
    ledBlock2.setFieldValue("3", "PIN");
    ledBlock2.setFieldValue("OFF", "STATE");

    connectToArduinoBlock(ledBlock2 as BlockSvg);
    connectToArduinoBlock(ledBlock1 as BlockSvg);

    const event = createTestEvent(ledBlock2.id);

    const [frame1, frame2] = eventToFrameFactory(event).frames;
    expect(frame1.components.length).toBe(1);
    expect(frame1.components[0].pins).toEqual(["3"]);
    expect((frame1.components[0] as LedState).state).toBe(1);
    expect((frame1.components[0] as LedState).fade).toBeFalsy();
    expect(frame1.explanation).toBe("Turning on led 3.");

    expect(frame2.components.length).toBe(1);
    expect(frame2.components[0].pins).toEqual(["3"]);
    expect((frame2.components[0] as LedState).state).toBe(0);
    expect((frame2.components[0] as LedState).fade).toBeFalsy();
    expect(frame2.explanation).toBe("Turning off led 3.");
  });

  it("should create 2 leds if they are using different pins", () => {
    const ledBlock1 = workspace.newBlock("led");
    ledBlock1.setFieldValue("3", "PIN");
    ledBlock1.setFieldValue("ON", "STATE");

    const ledBlock2 = workspace.newBlock("led");
    ledBlock2.setFieldValue("5", "PIN");
    ledBlock2.setFieldValue("OFF", "STATE");

    connectToArduinoBlock(ledBlock2 as BlockSvg);
    connectToArduinoBlock(ledBlock1 as BlockSvg);

    const event = createTestEvent(ledBlock2.id);

    const [frame1, frame2] = eventToFrameFactory(event).frames;
    expect(frame1.components.length).toBe(1);
    expect(frame1.components[0].pins).toEqual(["3"]);
    expect((frame1.components[0] as LedState).state).toBe(1);
    expect((frame1.components[0] as LedState).fade).toBeFalsy();
    expect(frame1.explanation).toBe("Turning on led 3.");

    expect(frame2.components.length).toBe(2);
    const led3State = frame2.components.find(
      (c: LedState) => c.pin === ARDUINO_PINS.PIN_3
    ) as LedState;

    const led5State = frame2.components.find(
      (c: LedState) => c.pin === ARDUINO_PINS.PIN_5
    ) as LedState;

    expect(led5State.fade).toBeFalsy();
    expect(led3State.fade).toBeFalsy();

    expect(led3State.pin).toBe("3");
    expect(led5State.pin).toBe("5");

    expect(led3State.state).toBe(1);
    expect(led5State.state).toBe(0);

    expect(frame2.explanation).toBe("Turning off led 5.");
  });

  it("should be able to do an led fade block", () => {
    const ledFadeBlock = workspace.newBlock("led_fade");
    connectToArduinoBlock(ledFadeBlock as BlockSvg);
    ledFadeBlock.setFieldValue("9", "PIN");
    const numBlock = createValueBlock(workspace, VariableTypes.NUMBER, 30);
    ledFadeBlock.getInput("FADE").connection.connect(numBlock.outputConnection);
    connectToArduinoBlock(ledFadeBlock as BlockSvg);
    const event = createTestEvent(ledFadeBlock.id);

    const [frame1] = eventToFrameFactory(event).frames;

    expect(frame1.components.length).toBe(1);
    expect((frame1.components[0] as LedState).fade).toBe(true);
    expect((frame1.components[0] as LedState).state).toBe(30);
    expect((frame1.components[0] as LedState).pin).toBe("9");
    expect(frame1.explanation).toBe("Fading Led 9 to 30.");
  });
});
