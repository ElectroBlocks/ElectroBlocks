import type { BlockEvent } from "../dto/event.type";
import { type ForLoopTextChange, ActionType } from "./actions";
import _ from "lodash";
// Changes the text on the for loop block to adding or subtracting
// Depending on whether the from is greater than to.
const updateForLoopText = (blockEvent: BlockEvent): ForLoopTextChange[] => {
  const forBlocks = blockEvent.blocks.filter(
    (block) => block.blockName === "controls_for"
  );

  return forBlocks.map((block) => {
    const fromInput = block.inputBlocks.find((input) => input.name === "FROM");
    const toInput = block.inputBlocks.find((input) => input.name === "TO");
    // This means that not all the input for the for are filled out so we just do by
    if (_.isEmpty(toInput.blockId) || _.isEmpty(fromInput.blockId)) {
      return {
        blockId: block.id,
        changeText: "by",
        type: ActionType.FOR_LOOP_BLOCK_CHANGE,
      };
    }

    const fromBlock = blockEvent.blocks.find(
      (block) => block.id == fromInput.blockId
    );
    const toBlock = blockEvent.blocks.find(
      (block) => block.id == toInput.blockId
    );

    // This means that they are using a variable and we have no way determining if it should be a by adding or by subtracting
    if (
      fromBlock.blockName !== "math_number" ||
      toBlock.blockName !== "math_number"
    ) {
      return {
        blockId: block.id,
        changeText: "by",
        type: ActionType.FOR_LOOP_BLOCK_CHANGE,
      };
    }

    const toNumber = +toBlock.fieldValues.find((field) => field.name == "NUM")
      .value;
    const fromNumber = +fromBlock.fieldValues.find(
      (field) => field.name == "NUM"
    ).value;

    // If the from number is greater than the toNumber
    // it's by subtracting because we have to minus to get to the from number
    const changeText = fromNumber > toNumber ? "by subtracting" : "by adding";
    return {
      blockId: block.id,
      changeText,
      type: ActionType.FOR_LOOP_BLOCK_CHANGE,
    };
  });
};

export default updateForLoopText;
