import { describe, it, beforeEach, afterEach, expect } from "vitest";

import "../blocks";
import Blockly, { BlockSvg } from "blockly";
import { connectToArduinoBlock, getAllBlocks } from "../helpers/block.helper";
import _ from "lodash";
import type { BlockEvent } from "../dto/event.type";
import { transformBlock } from "../transformers/block.transformer";
import { updateLoopNumberInSensorSetupBlock } from "./updateLoopNumberInSensorSetupBlock";
import { ActionType } from "./actions";
import { getAllVariables } from "../helpers/variable.helper";
import { transformVariable } from "../transformers/variables.transformer";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../tests/tests.helper";
import { MicroControllerType } from "../../microcontroller/microcontroller";
import { updateFastLedSetAllColorsUpdateBlock } from "./fastLedSetAllColorsUpdateBlock";

describe("fastLedSetAllColorsUpdateBlock", () => {
  let workspace;
  let arduinoBlock;
  let fastLedSetupBlock;
  let fastledSetAllColorsBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
    fastLedSetupBlock = workspace.newBlock("fastled_setup");
    fastledSetAllColorsBlock = workspace.newBlock("fastled_set_all_colors");
    connectToArduinoBlock(fastledSetAllColorsBlock);
  });

  it("testing the math", () => {
    testMathScenario(20, 8, 2);
    testMathScenario(30, 6, 3);
    testMathScenario(11, 11, 1);
    testMathScenario(50, 2, 5);
    testMathScenario(144, 12, 12);
  });

  it("should return nothing if there is no setup block", () => {
    fastLedSetupBlock.dispose(true);
    const event = createTestEvent(fastLedSetupBlock.id, Blockly.Events.MOVE);
    expect(updateFastLedSetAllColorsUpdateBlock(event)).toEqual([]);
  });

  it("should return nothing if the block is deleted", () => {
    fastledSetAllColorsBlock.dispose(true);
    const event = createTestEvent(
      fastledSetAllColorsBlock.id,
      Blockly.Events.DELETE
    );
    expect(updateFastLedSetAllColorsUpdateBlock(event)).toEqual([]);
  });

  function testMathScenario(maxLeds, maxColumnsOnLastRow, maxRows) {
    fastLedSetupBlock.setFieldValue(maxLeds, "NUMBER_LEDS");
    const event = createTestEvent(fastLedSetupBlock.id, Blockly.Events.MOVE);
    const [action] = updateFastLedSetAllColorsUpdateBlock(event);
    expect(action.maxLeds).toBe(maxLeds);
    expect(action.maxColumnsOnLastRow).toBe(maxColumnsOnLastRow);
    expect(action.maxRows).toBe(maxRows);
  }
});
