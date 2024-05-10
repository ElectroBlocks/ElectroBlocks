import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../../core/blockly/blocks";

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
    const digitalReadSetupBlock = workspace.newBlock(
      "digital_read_setup"
    ) as BlockSvg;

    digitalReadSetupBlock.setFieldValue("5", "PIN");

    const digitalReadBlock = workspace.newBlock("digital_read");

    saveSensorSetupBlockData(createTestEvent(digitalReadSetupBlock.id)).forEach(
      updater
    );

    digitalReadSetupBlock.setFieldValue("2", "LOOP");
    digitalReadSetupBlock.setFieldValue("FALSE", "isOn");
    saveSensorSetupBlockData(createTestEvent(digitalReadSetupBlock.id)).forEach(
      updater
    );

    expect(true).toBeTruthy();
    const setVariableBlock = createSetVariableBlockWithValue(
      workspace,
      "isOn",
      VariableTypes.BOOLEAN,
      true
    );
    setVariableBlock.getInput("VALUE").connection.disconnect();

    setVariableBlock
      .getInput("VALUE")
      .connection.connect(digitalReadBlock.outputConnection);

    connectToArduinoBlock(setVariableBlock);

    const [setupframe, frame1, frame2, frame3] = eventToFrameFactory(
      createTestEvent(digitalReadSetupBlock.id)
    ).frames;

    expect(frame1.variables["isOn"].value).toBeTruthy();
    expect(frame2.variables["isOn"].value).toBeFalsy();
    expect(frame3.variables["isOn"].value).toBeTruthy();
  });
});
