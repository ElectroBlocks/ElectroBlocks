import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import { Workspace, BlockSvg } from "blockly";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import _ from "lodash";
import { saveSensorSetupBlockData } from "../../core/blockly/actions/saveSensorSetupBlockData";
import { updater } from "../../core/blockly/updater";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import {
  ArduinoFrame,
  ArduinoComponentType,
} from "../../core/frames/arduino.frame";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { ThermistorState } from "./state";

describe("Thermistors Frames and Values", () => {
  let workspace: Workspace;
  let thermistorSetupBlock;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
    thermistorSetupBlock = workspace.newBlock("thermistor_setup");
    thermistorSetupBlock.setFieldValue("A4", "PIN");
  });

  it("should be able generate state for thermistor block.", () => {
    saveLoopData(10, thermistorSetupBlock, 1);
    saveLoopData(104, thermistorSetupBlock, 2);
    saveLoopData(204, thermistorSetupBlock, 3);

    const sensorBlock = workspace.newBlock("thermistor_read");

    const setVarNumBlock = createSetVariableBlockWithValue(
      workspace,
      "temp",
      VariableTypes.NUMBER,
      0
    );
    setVarNumBlock.getInput("VALUE").connection.targetBlock().dispose(true);

    setVarNumBlock
      .getInput("VALUE")
      .connection.connect(sensorBlock.outputConnection);

    connectToArduinoBlock(setVarNumBlock);

    const event = createTestEvent(setVarNumBlock.id);

    const [state1, state2, state3, state4] = eventToFrameFactory(event).frames;

    expect(state1.explanation).toBe("Setting up Thermistor");
    // setup block
    verifyState(state1, 10);
    // first loop
    verifyState(state2, 10);
    // second loop
    verifyState(state3, 104);
    // third loop
    verifyState(state4, 204);
  });
});

const saveLoopData = (temp: number, block: BlockSvg, loop: number) => {
  block.setFieldValue(loop.toString(), "LOOP");
  block.setFieldValue(temp.toString(), "TEMP");

  const event = createTestEvent(block.id);

  saveSensorSetupBlockData(event).forEach(updater);
};

const verifyState = (state: ArduinoFrame, temp: number) => {
  const components = state.components;
  expect(components.length).toBe(1);
  const [component] = state.components as ThermistorState[];
  expect(component.type).toBe(ArduinoComponentType.THERMISTOR);
  expect(component.pins).toEqual(["A4"]);
  expect(component.temp).toBe(temp);
};
