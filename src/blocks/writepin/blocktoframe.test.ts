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
import { WritePinState, WritePinType } from "./state";

describe("test leds", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;
  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });
  afterEach(() => {
    workspace.dispose();
  });

  it("should not create 1 digital write pin if they share the same pin number.", () => {
    const ledBlock1 = workspace.newBlock("digital_write");
    ledBlock1.setFieldValue("3", "PIN");
    ledBlock1.setFieldValue("ON", "STATE");

    const ledBlock2 = workspace.newBlock("digital_write");
    ledBlock2.setFieldValue("3", "PIN");
    ledBlock2.setFieldValue("OFF", "STATE");

    connectToArduinoBlock(ledBlock2 as BlockSvg);
    connectToArduinoBlock(ledBlock1 as BlockSvg);

    const event = createTestEvent(ledBlock2.id);

    const [frame1, frame2] = eventToFrameFactory(event).frames;
    expect(frame1.components.length).toBe(1);
    expect(frame1.components[0].pins).toEqual(["3"]);
    expect((frame1.components[0] as WritePinState).state).toBe(1);
    expect((frame1.components[0] as WritePinState).pinType).toBe(
      WritePinType.DIGITAL_OUTPUT
    );
    expect(frame1.explanation).toBe("Turning pin 3 on.");

    expect(frame2.components.length).toBe(1);
    expect(frame2.components[0].pins).toEqual(["3"]);
    expect((frame2.components[0] as WritePinState).state).toBe(0);
    expect((frame2.components[0] as WritePinState).pinType).toBe(
      WritePinType.DIGITAL_OUTPUT
    );
    expect(frame2.explanation).toBe("Turning pin 3 off.");
  });

  it("should create 2 digital write pins if they are using different pins", () => {
    const ledBlock1 = workspace.newBlock("digital_write");
    ledBlock1.setFieldValue("3", "PIN");
    ledBlock1.setFieldValue("ON", "STATE");

    const ledBlock2 = workspace.newBlock("digital_write");
    ledBlock2.setFieldValue("5", "PIN");
    ledBlock2.setFieldValue("OFF", "STATE");

    connectToArduinoBlock(ledBlock2 as BlockSvg);
    connectToArduinoBlock(ledBlock1 as BlockSvg);

    const event = createTestEvent(ledBlock2.id);

    const [frame1, frame2] = eventToFrameFactory(event).frames;
    expect(frame1.components.length).toBe(1);
    expect(frame1.components[0].pins).toEqual(["3"]);
    expect((frame1.components[0] as WritePinState).state).toBe(1);
    expect((frame1.components[0] as WritePinState).pinType).toBe(
      WritePinType.DIGITAL_OUTPUT
    );
    expect(frame1.explanation).toBe("Turning pin 3 on.");

    expect(frame2.components.length).toBe(2);
    const led3State = frame2.components.find(
      (c: WritePinState) => c.pin === ARDUINO_PINS.PIN_3
    ) as WritePinState;

    const led5State = frame2.components.find(
      (c: WritePinState) => c.pin === ARDUINO_PINS.PIN_5
    ) as WritePinState;

    expect(led5State.pinType).toBe(WritePinType.DIGITAL_OUTPUT);
    expect(led3State.pinType).toBe(WritePinType.DIGITAL_OUTPUT);

    expect(led3State.pin).toBe("3");
    expect(led5State.pin).toBe("5");

    expect(led3State.state).toBe(1);
    expect(led5State.state).toBe(0);

    expect(frame2.explanation).toBe("Turning pin 5 off.");
  });

  it("should be able to do an led fade block", () => {
    const ledFadeBlock = workspace.newBlock("analog_write");
    connectToArduinoBlock(ledFadeBlock as BlockSvg);
    ledFadeBlock.setFieldValue("9", "PIN");
    const numBlock = createValueBlock(workspace, VariableTypes.NUMBER, 30);
    ledFadeBlock
      .getInput("WRITE_VALUE")
      .connection.connect(numBlock.outputConnection);
    connectToArduinoBlock(ledFadeBlock as BlockSvg);
    const event = createTestEvent(ledFadeBlock.id);

    const [frame1] = eventToFrameFactory(event).frames;

    expect(frame1.components.length).toBe(1);
    expect((frame1.components[0] as WritePinState).pinType).toBe(
      WritePinType.ANALOG_OUTPUT
    );
    expect((frame1.components[0] as WritePinState).state).toBe(30);
    expect((frame1.components[0] as WritePinState).pin).toBe("9");
    expect(frame1.explanation).toBe("Sending 30 to pin 9.");
  });
});
