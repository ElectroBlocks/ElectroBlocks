import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import _ from "lodash";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../tests/tests.helper";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { updater } from "../../core/blockly/updater";
import { saveSensorSetupBlockData } from "../../core/blockly/actions/saveSensorSetupBlockData";
import {
  ArduinoComponentType,
  ArduinoFrame,
} from "../../core/frames/arduino.frame";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import type { IRRemoteState } from "./state";

describe("button state factories", () => {
  let workspace: Workspace;
  let irRemoteSetup;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    irRemoteSetup = workspace.newBlock("ir_remote_setup") as BlockSvg;
    irRemoteSetup.setFieldValue(ARDUINO_PINS.PIN_A4, "PIN");
    irRemoteSetup.setFieldValue("TRUE", "scanned_new_code");
    irRemoteSetup.setFieldValue("500", "code");

    const event = createTestEvent(irRemoteSetup.id);
    saveSensorSetupBlockData(event).forEach(updater);
  });

  it("should be able generate state for ir remote read setup block", () => {
    const event = createTestEvent(irRemoteSetup.id);

    const irRemote: IRRemoteState = {
      code: 500,
      pins: [ARDUINO_PINS.PIN_2],
      hasCode: true,
      pin: ARDUINO_PINS.PIN_2,
      type: ArduinoComponentType.IR_REMOTE,
      setupCommand: "register::ir::2",
      importLibraries: [
        {
          name: "IRremote",
          url: "https://downloads.arduino.cc/libraries/github.com/z3t0/IRremote-4.2.1.zip",
          version: "latest",
        },
      ],
      enableFlag: "ENABLE_IR_REMOTE",
    };

    const state: ArduinoFrame = {
      blockId: irRemoteSetup.id,
      blockName: "ir_remote_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "Setting up ir remote.",
      components: [irRemote],
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
