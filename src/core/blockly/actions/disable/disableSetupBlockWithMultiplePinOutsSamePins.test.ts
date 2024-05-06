import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../blocks";
import type { Workspace } from "blockly";
import _ from "lodash";
import { ActionType } from "../actions";
import { ARDUINO_PINS } from "../../../microcontroller/selectBoard";
import { disableSetupBlockWithMultiplePinOutsSamePins } from "./disableSetupBlockWithMultiplePinOutsSamePins";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../../tests/tests.helper";

describe("disableSensorReadBlocksWithWrongPins", () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("should disable blocks that use same pin twice", () => {
    const rfidBlockSetup = workspace.newBlock("rfid_setup");
    rfidBlockSetup.setFieldValue(ARDUINO_PINS.PIN_5, "PIN_TX");

    const setupBlock2 = workspace.newBlock("bluetooth_setup");
    setupBlock2.setFieldValue(ARDUINO_PINS.PIN_10, "PIN_TX");
    setupBlock2.setFieldValue(ARDUINO_PINS.PIN_10, "PIN_RX");
    const event = createTestEvent(arduinoBlock.id);

    const actions = disableSetupBlockWithMultiplePinOutsSamePins(event);
    expect(actions.length).toBe(1);
    expect(actions[0].blockId).toBe(setupBlock2.id);
    expect(actions[0].warningText).toBeDefined();
    expect(actions[0].type).toBe(ActionType.DISABLE_BLOCK);
  });
});
