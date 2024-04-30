import "../../core/blockly/blocks";
import { describe, it, beforeEach, afterEach, expect } from "vitest";
import type { BlockSvg, Workspace } from "blockly";
import { saveSensorSetupBlockData } from "../../core/blockly/actions/saveSensorSetupBlockData";
import { VariableTypes } from "../../core/blockly/dto/variable.type";
import { connectToArduinoBlock } from "../../core/blockly/helpers/block.helper";
import { updater } from "../../core/blockly/updater";
import { eventToFrameFactory } from "../../core/frames/event-to-frame.factory";
import {
  createArduinoAndWorkSpace,
  createSetVariableBlockWithValue,
  createTestEvent,
} from "../../tests/tests.helper";
import { analogReadSetup } from "./blocktoframe";

describe("sensor value blocks", () => {
  let workspace: Workspace;
  let arduinoBlock: BlockSvg;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    arduinoBlock.setFieldValue("3", "LOOP_TIMES");
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("should be able to change based on the sensor data", () => {
    const analogReadSetupBlock = workspace.newBlock(
      "analog_read_setup"
    ) as BlockSvg;

    analogReadSetupBlock.setFieldValue("1", "state");

    analogReadSetupBlock.setFieldValue("A3", "PIN");

    const analogReadBlock = workspace.newBlock("analog_read");
    analogReadBlock.setFieldValue("A3", "PIN");

    saveSensorSetupBlockData(createTestEvent(analogReadSetupBlock.id)).forEach(
      updater
    );

    analogReadSetupBlock.setFieldValue("2", "LOOP");
    analogReadSetupBlock.setFieldValue("30", "state");
    saveSensorSetupBlockData(createTestEvent(analogReadSetupBlock.id)).forEach(
      updater
    );

    const setVariableBlock = createSetVariableBlockWithValue(
      workspace,
      "state",
      VariableTypes.NUMBER,
      true
    );
    setVariableBlock.getInput("VALUE").connection.disconnect();

    setVariableBlock
      .getInput("VALUE")
      .connection.connect(analogReadBlock.outputConnection);

    connectToArduinoBlock(setVariableBlock);

    const [setupframe, frame1, frame2, frame3] = eventToFrameFactory(
      createTestEvent(analogReadSetupBlock.id)
    ).frames;

    expect(frame1.variables["state"].value).toBe(1);
    expect(frame2.variables["state"].value).toBe(30);
    expect(frame3.variables["state"].value).toBe(1);
  });
});
