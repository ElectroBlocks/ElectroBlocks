import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../blocks";
import type { Workspace, BlockSvg } from "blockly";
import { transformBlock } from "./block.transformer";
import { BlockType, PinCategory } from "../dto/block.type";
import { connectToArduinoBlock } from "../helpers/block.helper";
import _ from "lodash";
import { createArduinoAndWorkSpace } from "../../../tests/tests.helper";

describe("block transformer", () => {
  let workspace: Workspace;
  let arduinoLoopBlock: BlockSvg;

  beforeEach(() => {
    [workspace, arduinoLoopBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  it("should be able to be able to parse arduino loop block and blocks inside", () => {
    const debugBlock1 = workspace.newBlock("debug_block") as BlockSvg;
    const debugBlock2 = workspace.newBlock("debug_block") as BlockSvg;
    const servoBlock = workspace.newBlock("rotate_servo") as BlockSvg;

    // Connects it to the top part of the input statement
    connectToArduinoBlock(debugBlock2);
    connectToArduinoBlock(servoBlock);
    connectToArduinoBlock(debugBlock1);

    const arduinoLoopData = transformBlock(arduinoLoopBlock);
    expect(arduinoLoopData.inputStatements[0].name).toBe("loop");
    expect(arduinoLoopData.inputStatements[0].blockId).toBe(debugBlock1.id);
    expect(arduinoLoopData.fieldValues).toEqual([
      { name: "LOOP_TIMES", value: 3 },
    ]);
    expect(arduinoLoopData.inputBlocks).toEqual([]);

    const debug1Data = transformBlock(debugBlock1);
    expect(debug1Data.nextBlockId).toBe(servoBlock.id);
    expect(debug1Data.blockName).toBe("debug_block");
    expect(debug1Data.id).toBe(debugBlock1.id);

    const servoData = transformBlock(servoBlock);
    expect(servoData.nextBlockId).toBe(debugBlock2.id);
    expect(servoData.blockName).toBe("rotate_servo");
    expect(servoData.id).toBe(servoBlock.id);

    const debug2Data = transformBlock(debugBlock2);
    expect(debug2Data.nextBlockId).toBeUndefined();
    expect(debug2Data.id).toBe(debugBlock2.id);
  });

  it("should be able to parse servo block with inputs", () => {
    const servoBlock = workspace.newBlock("rotate_servo") as BlockSvg;
    const numberBlock = workspace.newBlock("math_number") as BlockSvg;
    const servoDataNoDegree = transformBlock(servoBlock);

    expect(servoDataNoDegree.inputBlocks).toEqual([
      { name: "DEGREE", blockId: undefined },
    ]);

    servoBlock
      .getInput("DEGREE")
      .connection.connect(numberBlock.outputConnection);

    const servoDataWithDegree = transformBlock(servoBlock);

    expect(servoDataWithDegree.inputBlocks).toEqual([
      { name: "DEGREE", blockId: numberBlock.id },
    ]);
  });

  it("should be able to parse a value block", () => {
    const numberBlock = workspace.newBlock("math_number") as BlockSvg;
    numberBlock.setFieldValue("40", "NUM");
    const numberBlockData = transformBlock(numberBlock);
    expect(numberBlockData.fieldValues[0].name).toBe("NUM");
    expect(numberBlockData.fieldValues[0].value).toBe(40);
  });

  it("should be able to transform a setup block", () => {
    const bluetoothSetupBlock = workspace.newBlock(
      "bluetooth_setup"
    ) as BlockSvg;
    bluetoothSetupBlock.data = JSON.stringify([
      { recieved_message: true, message: "test", loop: 1 },
    ]);
    const bluetoothSetupData = transformBlock(bluetoothSetupBlock);
    expect(bluetoothSetupData.id).toBe(bluetoothSetupBlock.id);
    expect(bluetoothSetupData.blockName).toBe("bluetooth_setup");
    expect(bluetoothSetupData.type).toBe(BlockType.SENSOR_SETUP);
    expect(bluetoothSetupData.inputBlocks).toEqual([]);
    expect(bluetoothSetupData.inputStatements).toEqual([]);
    expect(bluetoothSetupData.fieldValues.map((field) => field.name)).toEqual([
      "PIN_RX",
      "PIN_TX",
      "LOOP",
      "receiving_message",
      "message",
      "COPY_SAME"
    ]);

    bluetoothSetupData.metaData = bluetoothSetupBlock.data;
    bluetoothSetupData.fieldValues.forEach((field) => {
      expect(field.value).toBeDefined();
    });
    expect(bluetoothSetupData.rootBlockId).toBeUndefined();
    expect(bluetoothSetupData.pins).toEqual([
      bluetoothSetupBlock.getFieldValue("PIN_RX"),
      bluetoothSetupBlock.getFieldValue("PIN_TX"),
    ]);
    expect(bluetoothSetupData.pinCategory).toBe(PinCategory.BLUETOOTH);
    expect(bluetoothSetupData.nextBlockId).toBeUndefined();
    expect(bluetoothSetupData.disabled).toBeFalsy();

    bluetoothSetupBlock.setEnabled(false);
    const bluetoothSetupData2 = transformBlock(bluetoothSetupBlock);
    expect(bluetoothSetupData2.disabled).toBeTruthy();
  });
});
