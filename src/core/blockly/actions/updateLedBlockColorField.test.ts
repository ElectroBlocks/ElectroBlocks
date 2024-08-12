import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../blocks";
import type { BlockEvent } from "../dto/event.type";
import updateLedColor from "./updateLedBlockColorField";
import { ActionType } from "./actions";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../tests/tests.helper";
import { ARDUINO_PINS } from "../../microcontroller/selectBoard";

describe("updateLedBlockColorField", () => {
  let workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("should return an empty array if no for blocks are present", () => {
    const event: BlockEvent = createTestEvent(arduinoBlock.id);

    expect(updateLedColor(event)).toEqual([]);
  });

  it("should return an empty array if led block is deleted", () => {
    const event: BlockEvent = createTestEvent(arduinoBlock.id);

    expect(updateLedColor(event)).toEqual([]);
  });

  it("should return 1 led block if it change and leave the other one with a different pin alone", () => {
    const led3Block1 = workspace.newBlock("led");
    led3Block1.setFieldValue(ARDUINO_PINS.PIN_3, "PIN");
    led3Block1.setFieldValue("#008000", "COLOR");

    const led3Block2 = workspace.newBlock("led");
    led3Block2.setFieldValue(ARDUINO_PINS.PIN_3, "PIN");
    led3Block2.setFieldValue("#ffa500", "COLOR");

    const led4Block2 = workspace.newBlock("led");
    led4Block2.setFieldValue(ARDUINO_PINS.PIN_4, "PIN");

    const event: BlockEvent = createTestEvent(led3Block2.id);
    const actions = updateLedColor(event);
    expect(actions).length(1);
    expect(actions).toEqual([
      {
        blockId: led3Block1.id,
        color: "#ffa500",
        type: ActionType.UPDATE_LED_COLOR,
      },
    ]);
  });
});
