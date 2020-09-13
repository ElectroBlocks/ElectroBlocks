import { BlockSvg } from "blockly";
import {
  BlockData,
  Input,
  InputStatement,
  blocksToBlockTypes,
  FieldValue,
  PinFieldNames,
  BlocklyInputTypes,
} from "../dto/block.type";
import _ from "lodash";
import { ARDUINO_PINS } from "../../microcontroller/selectBoard";

export interface BlockTransformer {
  (block: BlockSvg): BlockData;
}

const getNextBlockId = (block: BlockSvg): string | undefined => {
  if (_.isEmpty(block.nextConnection)) {
    return undefined;
  }

  if (_.isEmpty(block.nextConnection.targetBlock())) {
    return undefined;
  }

  return block.nextConnection.targetBlock().id;
};

const getRootBlockId = (block: BlockSvg): string | undefined => {
  const rootBlock = block.getRootBlock();
  return rootBlock && rootBlock.id !== block.id ? rootBlock.id : undefined;
};

const getFieldValues = (block: BlockSvg): FieldValue[] => {
  return block.inputList
    .map((input) => {
      return input.fieldRow
        .filter(
          (field) =>
            field.EDITABLE ||
            (block.type === "procedures_callnoreturn" && field.name === "NAME")
        )
        .map((field) => {
          return {
            name: field.name,
            value: field.getValue(),
          };
        });
    })
    .reduce((prev, next) => {
      return [...prev, ...next];
    }, []);
};

const getPins = (block: BlockSvg): ARDUINO_PINS[] => {
  if (block.type === "lcd_setup") {
    return [ARDUINO_PINS.PIN_A4, ARDUINO_PINS.PIN_A5];
  }

  if (
    block.type === "led_matrix_make_draw" ||
    block.type === "led_matrix_turn_one_on_off"
  ) {
    return [ARDUINO_PINS.PIN_10, ARDUINO_PINS.PIN_11, ARDUINO_PINS.PIN_12];
  }

  return getFieldValues(block)
    .filter((field) => field["name"].includes("PIN"))
    .map((field) => field.value as ARDUINO_PINS);
};

const getInputs = (block: BlockSvg): Input[] => {
  return block.inputList
    .filter((input) => input.type === +BlocklyInputTypes.INPUT_BLOCK)
    .map((input) => {
      const targetBlock = input.connection.targetBlock();
      const name = input.name;

      const blockId = targetBlock ? targetBlock.id : undefined;
      return {
        name,
        blockId,
      };
    });
};

const getInputStatements = (block: BlockSvg): InputStatement[] => {
  return block.inputList
    .filter((input) => input.type === +BlocklyInputTypes.INPUT_STATEMENT)
    .map((input) => {
      const targetBlock = block.getInputTargetBlock(input.name);
      const name = input.name;
      const blockId = targetBlock ? targetBlock.id : undefined;
      return {
        name,
        blockId,
      };
    });
};

export const transformBlock = (block: BlockSvg): BlockData => {
  return {
    id: block.id,
    blockName: block.type,
    type: blocksToBlockTypes[block.type].type,
    inputBlocks: getInputs(block),
    inputStatements: getInputStatements(block),
    fieldValues: getFieldValues(block),
    nextBlockId: getNextBlockId(block),
    rootBlockId: getRootBlockId(block),
    pinCategory: blocksToBlockTypes[block.type].pinCategory,
    pins: getPins(block),
    metaData: block.data,
    disabled: !block.isEnabled(),
  };
};
