import "jest";
import "../../../blockly/blocks";
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from "blockly";
import {
  getAllBlocks,
  getBlockById,
} from "../../../blockly/helpers/block.helper";
import _ from "lodash";
import { BlockEvent } from "../../../blockly/dto/event.type";
import { transformBlock } from "../../../blockly/transformers/block.transformer";
import { getAllVariables } from "../../../blockly/helpers/variable.helper";
import { transformVariable } from "../../../blockly/transformers/variables.transformer";
import { saveSensorSetupBlockData } from "../../../blockly/actions/factories/saveSensorSetupBlockData";
import { updater } from "../../../blockly/updater";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../../tests/tests.helper";
import { UltraSonicSensorState } from "../../arduino-components.state";
import { eventToFrameFactory } from "../../event-to-frame.factory";
import { ArduinoFrame, ArduinoComponentType } from "../../arduino.frame";
import { ARDUINO_PINS } from "../../../microcontroller/selectBoard";

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
    ultraSonicSensor.setFieldValue("11", "TRIG");
    ultraSonicSensor.setFieldValue("12", "ECHO");
    ultraSonicSensor.setFieldValue("10", "cm");

    const event = createTestEvent(ultraSonicSensor.id);
    saveSensorSetupBlockData(event).forEach(updater);
  });

  test("should be able generate state for ultra sonic sensor setup block", () => {
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
    };

    expect(eventToFrameFactory(event).frames).toEqual([state]);
  });
});
