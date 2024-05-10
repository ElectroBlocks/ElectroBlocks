import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace } from "blockly";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { saveSensorSetupBlockData } from "../../core/blockly/actions/saveSensorSetupBlockData";
import { updater } from "../../core/blockly/updater";
import {
  ArduinoFrame,
  ArduinoComponentType,
} from "../../core/frames/arduino.frame";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../tests/tests.helper";
import type { RfidState } from "./state";

describe("rfid state factories", () => {
  let workspace: Workspace;
  let rfidBlock;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();

    rfidBlock = workspace.newBlock("rfid_setup");
    rfidBlock.setFieldValue(ARDUINO_PINS.PIN_6, "PIN_TX");

    rfidBlock.setFieldValue("TRUE", "scanned_card");
    rfidBlock.setFieldValue("card_num", "card_number");
    rfidBlock.setFieldValue("tag", "tag");

    const event = createTestEvent(rfidBlock.id);
    saveSensorSetupBlockData(event).forEach(updater);
  });

  it("should be able generate state for rfid setup block", () => {
    const event = createTestEvent(rfidBlock.id);

    const rfidComponent: RfidState = {
      pins: [ARDUINO_PINS.PIN_6],
      txPin: ARDUINO_PINS.PIN_6,
      scannedCard: true,
      cardNumber: "card_num",
      tag: "tag",
      type: ArduinoComponentType.RFID,
    };

    const rfidSetupState: ArduinoFrame = {
      blockId: rfidBlock.id,
      blockName: "rfid_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "Setting up RFID.",
      components: [rfidComponent],
      variables: {},
      txLedOn: false,
      builtInLedOn: false,
      sendMessage: "", // message arduino is sending
      delay: 0, // Number of milliseconds to delay
      powerLedOn: true,
      frameNumber: 1,
    };

    expect(eventToFrameFactory(event).frames).toEqual([rfidSetupState]);
  });
});
