import type { BlockSvg, Workspace } from "blockly";
import { describe, it, beforeEach, afterEach, expect } from "vitest";

import { saveSensorSetupBlockData } from "../../core/blockly/actions/saveSensorSetupBlockData";
import "../../core/blockly/blocks";
import { updater } from "../../core/blockly/updater";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../tests/tests.helper";
import { DigitalPictureType, DigitalSensorState } from "./state";

describe("test digital sensor blocks", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });
  afterEach(() => {
    workspace.dispose();
  });

  it("should be able to setup a sensors with different pictures.", () => {
    const digitalReadSetupBlock1 = workspace.newBlock(
      "digital_read_setup"
    ) as BlockSvg;

    digitalReadSetupBlock1.setFieldValue("5", "PIN");
    digitalReadSetupBlock1.setFieldValue("SENSOR", "TYPE");

    const event = createTestEvent(digitalReadSetupBlock1.id);

    const digitalReadSetupBlock2 = workspace.newBlock(
      "digital_read_setup"
    ) as BlockSvg;

    digitalReadSetupBlock2.setFieldValue("9", "PIN");
    digitalReadSetupBlock2.setFieldValue("TOUCH_SENSOR", "TYPE");
    const event1 = createTestEvent(digitalReadSetupBlock2.id);

    saveSensorSetupBlockData(event).forEach(updater);
    saveSensorSetupBlockData(event1).forEach(updater);

    const event3 = createTestEvent(digitalReadSetupBlock2.id);

    const [frame1, frame2] = eventToFrameFactory(event3).frames;

    expect(frame1.explanation).toBe("Setting up digital sensor 5.");
    expect(frame2.explanation).toBe("Setting up touch sensor 9.");

    expect(frame1.components.length).toBe(1);
    const frame1sensor = frame1.components.find((c) =>
      c.pins.includes(ARDUINO_PINS.PIN_5)
    ) as DigitalSensorState;
    expect(frame1sensor.pictureType).toBe(DigitalPictureType.SENSOR);

    expect(frame2.components.length).toBe(2);
    const frame2sensor5 = frame2.components.find((c) =>
      c.pins.includes(ARDUINO_PINS.PIN_5)
    ) as DigitalSensorState;

    const frame2sensor9 = frame2.components.find((c) =>
      c.pins.includes(ARDUINO_PINS.PIN_9)
    ) as DigitalSensorState;

    expect(frame2sensor9.pictureType).toBe(DigitalPictureType.TOUCH_SENSOR);
    expect(frame2sensor5.pictureType).toBe(DigitalPictureType.SENSOR);
  });
});
