import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";
import type { Workspace, BlockSvg, Block } from "blockly";
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
import { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import {
  getDefaultValue,
  findComponent,
} from "../../core/frames/transformer/frame-transformer.helpers";
import type { TemperatureState } from "./state";

describe("rfid value factories", () => {
  let workspace: Workspace;

  afterEach(() => {
    workspace.dispose();
  });

  beforeEach(() => {
    [workspace] = createArduinoAndWorkSpace();
  });

  it("should be able generate state for temp sesnor setup block", () => {
    const tempSetupBlock = workspace.newBlock("temp_setup") as BlockSvg;
    const tempReadBlock = workspace.newBlock("temp_get_temp");
    const tempHumidityBlock = workspace.newBlock("temp_get_humidity");
    tempSetupBlock.setFieldValue(ARDUINO_PINS.PIN_8, "PIN");

    const tempVarBlock = createVariableBlock(
      "temp",
      VariableTypes.NUMBER,
      tempReadBlock,
      workspace
    );

    const humidityVarBlock = createVariableBlock(
      "humidity",
      VariableTypes.NUMBER,
      tempHumidityBlock,
      workspace
    );

    setSetupBlock(1, 30, 50, tempSetupBlock);
    setSetupBlock(2, 130, 110, tempSetupBlock);

    connectToArduinoBlock(tempVarBlock);
    tempVarBlock.nextConnection.connect(humidityVarBlock.previousConnection);

    const [setup, state1, state2, state3, state4] = eventToFrameFactory(
      createTestEvent(humidityVarBlock.id)
    ).frames;

    expect(_.keys(state1.variables).length).toBe(1);
    verifyVariables(state1, 30, undefined);
    verifyComponent(state1, 30, 50);

    verifyVariables(state2, 30, 50);
    verifyComponent(state2, 30, 50);

    verifyVariables(state3, 130, 50);
    verifyComponent(state3, 130, 110);

    verifyVariables(state4, 130, 110);
    verifyComponent(state4, 130, 110);
  });
});

const createVariableBlock = (
  variableName: string,
  type: VariableTypes,
  sensorBlock: Block,
  workspace: Workspace
) => {
  const varBlock = createSetVariableBlockWithValue(
    workspace,
    variableName,
    type,
    getDefaultValue(type)
  );
  varBlock.getInput("VALUE").connection.targetBlock().dispose(true);

  varBlock.getInput("VALUE").connection.connect(sensorBlock.outputConnection);

  return varBlock;
};

const setSetupBlock = (
  loopNumber: number,
  temp: number,
  humidity: number,
  setupBlock: BlockSvg
) => {
  setupBlock.setFieldValue(humidity.toString(), "humidity");
  setupBlock.setFieldValue(temp.toString(), "temp");
  setupBlock.setFieldValue(loopNumber.toString(), "LOOP");

  saveSensorSetupBlockData(createTestEvent(setupBlock.id)).forEach(updater);
};

const verifyComponent = (
  state: ArduinoFrame,
  temp: number,
  humidity: number
) => {
  const tempState = findComponent<TemperatureState>(
    state,
    ArduinoComponentType.TEMPERATURE_SENSOR
  );

  expect(tempState.temperature).toBe(temp);
  expect(tempState.humidity).toBe(humidity);
};

const verifyVariables = (
  state: ArduinoFrame,
  temp: number | undefined,
  humidity: number | undefined
) => {
  if (temp !== undefined) {
    expect(state.variables["temp"].value).toBe(temp);
  }

  if (humidity !== undefined) {
    expect(state.variables["humidity"].value).toBe(humidity);
  }
};
