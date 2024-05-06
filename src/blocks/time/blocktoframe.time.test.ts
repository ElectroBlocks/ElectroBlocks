import "../../core/blockly/blocks";
import type { Workspace } from "blockly";
import _ from "lodash";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import {
  ArduinoFrame,
  ArduinoComponentType,
} from "../../core/frames/arduino.frame";
import { TimeState } from "./state";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../tests/tests.helper";
import { describe, it, beforeEach, afterEach, expect } from "vitest";

describe("time state factories", () => {
  let workspace: Workspace;
  let timesetup;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    timesetup = workspace.newBlock("time_setup");

    timesetup.setFieldValue(".3", "time_in_seconds");
  });

  it("should be able generate state for time setup block", () => {
    const event = createTestEvent(timesetup.id);

    const timeState: TimeState = {
      pins: [],
      timeInSeconds: 0.3,
      type: ArduinoComponentType.TIME,
    };

    const state: ArduinoFrame = {
      blockId: timesetup.id,
      blockName: "time_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "Setting up Arduino time.",
      components: [timeState],
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
