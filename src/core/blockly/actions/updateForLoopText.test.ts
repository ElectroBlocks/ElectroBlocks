import "jest";
import "../../blocks";
import _ from "lodash";
import { BlockEvent } from "../dto/event.type";
import updateForLoopText from "./updateForLoopText";
import { ForLoopTextChange, ActionType } from "./actions";
import {
  createArduinoAndWorkSpace,
  createTestEvent,
} from "../../../tests/tests.helper";

describe("updateForLoopText", () => {
  let workspace;
  let arduinoBlock;

  beforeEach(() => {
    [workspace, arduinoBlock] = createArduinoAndWorkSpace();
  });

  afterEach(() => {
    workspace.dispose();
  });

  test("should return an empty array if no for blocks are present", () => {
    const event: BlockEvent = createTestEvent(arduinoBlock.id);

    expect(updateForLoopText(event)).toEqual([]);
  });

  test("from number greater than to number", () => {
    const forBlock = createForLoopBlock(30, 10);
    const event = createTestEvent(arduinoBlock.id);

    const forTextAction: ForLoopTextChange = {
      blockId: forBlock.id,
      changeText: "by subtracting",
      type: ActionType.FOR_LOOP_BLOCK_CHANGE,
    };

    expect(updateForLoopText(event)).toEqual([forTextAction]);
  });

  test("to number greater than from number", () => {
    const forBlock = createForLoopBlock(10, 30);
    const event = createTestEvent(arduinoBlock.id);

    const forTextAction: ForLoopTextChange = {
      blockId: forBlock.id,
      changeText: "by adding",
      type: ActionType.FOR_LOOP_BLOCK_CHANGE,
    };

    expect(updateForLoopText(event)).toEqual([forTextAction]);
  });

  test("empty for loop block uses by", () => {
    const forBlock = workspace.newBlock("controls_for");
    const event = createTestEvent(arduinoBlock.id);

    const forTextAction: ForLoopTextChange = {
      blockId: forBlock.id,
      changeText: "by",
      type: ActionType.FOR_LOOP_BLOCK_CHANGE,
    };

    expect(updateForLoopText(event)).toEqual([forTextAction]);
  });

  test("variables for number block uses by", () => {
    const forBlock = workspace.newBlock("controls_for");
    const fromBlock = workspace.newBlock("variables_get_number");
    const toBlock = workspace.newBlock("math_number");

    forBlock.getInput("TO").connection.connect(toBlock.outputConnection);
    forBlock.getInput("FROM").connection.connect(fromBlock.outputConnection);

    const event: BlockEvent = createTestEvent(arduinoBlock.id);

    const forTextAction: ForLoopTextChange = {
      blockId: forBlock.id,
      changeText: "by",
      type: ActionType.FOR_LOOP_BLOCK_CHANGE,
    };

    expect(updateForLoopText(event)).toEqual([forTextAction]);
  });

  const createForLoopBlock = (from: number, to: number) => {
    const forBlock = workspace.newBlock("controls_for");
    const toBlock = workspace.newBlock("math_number");
    const fromBlock = workspace.newBlock("math_number");
    toBlock.setFieldValue(to.toString(), "NUM");
    fromBlock.setFieldValue(from.toString(), "NUM");
    forBlock.getInput("TO").connection.connect(toBlock.outputConnection);
    forBlock.getInput("FROM").connection.connect(fromBlock.outputConnection);

    return forBlock;
  };
});
