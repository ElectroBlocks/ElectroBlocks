import "jest";
import "../../../blockly/blocks";
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from "blockly";
import {
  getAllBlocks,
  getBlockById,
  connectToArduinoBlock,
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
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../../../tests/tests.helper";
import { UltraSonicSensorState } from "../../arduino-components.state";
import { eventToFrameFactory } from "../../event-to-frame.factory";
import { ArduinoFrame, ArduinoComponentType } from "../../arduino.frame";
import { ARDUINO_PINS } from "../../../microcontroller/selectBoard";
import { VariableTypes } from "../../../blockly/dto/variable.type";
import { MicroControllerType } from "../../../microcontroller/microcontroller";

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
  });

  test("should be able generate state for ultra sonic sensor setup block", () => {
    saveLoopData(10, ultraSonicSensor, 1);
    saveLoopData(104, ultraSonicSensor, 2);
    saveLoopData(204, ultraSonicSensor, 3);

    const sensorBlock = workspace.newBlock("ultra_sonic_sensor_motion");

    const setVarNumBlock = createSetVariableBlockWithValue(
      workspace,
      "distance",
      VariableTypes.NUMBER,
      0
    );
    setVarNumBlock.getInput("VALUE").connection.targetBlock().dispose(true);

    setVarNumBlock
      .getInput("VALUE")
      .connection.connect(sensorBlock.outputConnection);

    connectToArduinoBlock(setVarNumBlock);

    const event = createTestEvent(setVarNumBlock.id);

    const [setup, state1, state2, state3] = eventToFrameFactory(event).frames;

    verifyState(state1, 10);
    verifyState(state2, 104);
    verifyState(state3, 204);
  });
});

const verifyState = (state: ArduinoFrame, distance: number) => {
  const component = state.components[0] as UltraSonicSensorState;
  expect(state.variables["distance"].value).toBe(distance);
  expect(component.cm).toBe(distance);
};

const saveLoopData = (distance: number, block: BlockSvg, loop: number) => {
  block.setFieldValue(loop.toString(), "LOOP");
  block.setFieldValue(distance.toString(), "cm");

  const event = createTestEvent(block.id);

  saveSensorSetupBlockData(event).forEach(updater);
};
