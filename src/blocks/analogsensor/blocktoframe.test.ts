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
import { AnalogSensorPicture, AnalogSensorState } from "./state";

describe("test analog sensor blocks", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });
  afterEach(() => {
    workspace.dispose();
  });

  it("should be able to setup a sensors with different pictures.", () => {
    const analogReadSetupBlock1 = workspace.newBlock(
      "analog_read_setup"
    ) as BlockSvg;

    analogReadSetupBlock1.setFieldValue("A1", "PIN");
    analogReadSetupBlock1.setFieldValue("SENSOR", "TYPE");

    const event = createTestEvent(analogReadSetupBlock1.id);

    const analogReadSetupBlock2 = workspace.newBlock(
      "analog_read_setup"
    ) as BlockSvg;

    analogReadSetupBlock2.setFieldValue("A2", "PIN");
    analogReadSetupBlock2.setFieldValue("PHOTO_SENSOR", "TYPE");
    const event1 = createTestEvent(analogReadSetupBlock2.id);

    saveSensorSetupBlockData(event).forEach(updater);
    saveSensorSetupBlockData(event1).forEach(updater);

    const event3 = createTestEvent(analogReadSetupBlock2.id);

    const [frame1, frame2] = eventToFrameFactory(event3).frames;

    expect(frame1.explanation).toBe("Setting up analog sensor A1.");
    expect(frame2.explanation).toBe("Setting up photo sensor A2.");

    expect(frame1.components.length).toBe(1);
    const frame1sensor = frame1.components.find((c) =>
      c.pins.includes(ARDUINO_PINS.PIN_A1)
    ) as AnalogSensorState;
    expect(frame1sensor.pictureType).toBe(AnalogSensorPicture.SENSOR);

    expect(frame2.components.length).toBe(2);
    const frame2sensorA1 = frame2.components.find((c) =>
      c.pins.includes(ARDUINO_PINS.PIN_A1)
    ) as AnalogSensorState;

    const frame2sensorA2 = frame2.components.find((c) =>
      c.pins.includes(ARDUINO_PINS.PIN_A2)
    ) as AnalogSensorState;

    expect(frame2sensorA2.pictureType).toBe(AnalogSensorPicture.PHOTO_SENSOR);
    expect(frame2sensorA1.pictureType).toBe(AnalogSensorPicture.SENSOR);
  });
});
