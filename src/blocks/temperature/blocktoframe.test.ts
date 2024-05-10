import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace, BlockSvg } from "blockly";
import _ from "lodash";
import { saveSensorSetupBlockData } from "../../core/blockly/actions/saveSensorSetupBlockData";
import { updater } from "../../core/blockly/updater";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../tests/tests.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import {
  ArduinoFrame,
  ArduinoComponentType,
} from "../../core/frames/arduino.frame";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import type { TemperatureState } from "./state";

describe("rfid state factories", () => {
  let workspace: Workspace;
  let tempBlock;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    tempBlock = workspace.newBlock("temp_setup") as BlockSvg;
    tempBlock.setFieldValue("70", "humidity");
    tempBlock.setFieldValue("50", "temp");
    tempBlock.setFieldValue(ARDUINO_PINS.PIN_8, "PIN");

    const event = createTestEvent(tempBlock.id);
    saveSensorSetupBlockData(event).forEach(updater);
  });

  it("should be able generate state for temp sesnor setup block", () => {
    const event = createTestEvent(tempBlock.id);

    const tempSensorState: TemperatureState = {
      pins: [ARDUINO_PINS.PIN_8],
      temperature: 50,
      humidity: 70,
      type: ArduinoComponentType.TEMPERATURE_SENSOR,
    };

    const state: ArduinoFrame = {
      blockId: tempBlock.id,
      blockName: "temp_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "Setting up temperature sensor.",
      components: [tempSensorState],
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
