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
import type { UltraSonicSensorState } from "./state";

describe("ultra sonic sensor state factories", () => {
  let workspace: Workspace;
  let ultraSonicSensor;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    ultraSonicSensor = workspace.newBlock(
      "ultra_sonic_sensor_setup"
    ) as BlockSvg;
    ultraSonicSensor.setFieldValue("11", "PIN_TRIG");
    ultraSonicSensor.setFieldValue("12", "PIN_ECHO");
    ultraSonicSensor.setFieldValue("10", "cm");

    const event = createTestEvent(ultraSonicSensor.id);
    saveSensorSetupBlockData(event).forEach(updater);
  });

  it("should be able generate state for ultra sonic sensor setup block", () => {
    const event = createTestEvent(ultraSonicSensor.id);

    const ultraSonicSensorState: UltraSonicSensorState = {
      pins: [ARDUINO_PINS.PIN_11, ARDUINO_PINS.PIN_12],
      echoPin: ARDUINO_PINS.PIN_12,
      trigPin: ARDUINO_PINS.PIN_11,
      cm: 10,
      type: ArduinoComponentType.ULTRASONICE_SENSOR,
    };

    const state: ArduinoFrame = {
      blockId: ultraSonicSensor.id,
      blockName: "ultra_sonic_sensor_setup",
      timeLine: { function: "pre-setup", iteration: 0 },
      explanation: "Setting up ultra sonic sensor.",
      components: [ultraSonicSensorState],
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
