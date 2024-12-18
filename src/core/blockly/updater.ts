import {
  VariableAction,
  ForLoopTextChange,
  UpdateSetupSensorBlockFields,
  UpdateSetupSensorBlockLoop,
  DisableBlock,
  EnableBlock,
  SaveSetupSensorData,
  ActionType,
  Action,
  UpdateLCDScreenPrintBlock,
  UpdateLedColor,
  UpdateComponentSetupBlock as UpdateMultipleComponentSetupBlock,
  UpdateSetAllFastLedBlock,
  CommentForButtonBlockAction,
} from "./actions/actions";
import { deleteVariable } from "./helpers/variable.helper";
import {
  getBlockById,
  getBlockByType,
  getBlocksByName,
} from "./helpers/block.helper";
import _ from "lodash";
import Blockly from "blockly";
import { ArduinoComponentType } from "../frames/arduino.frame";

export interface Updater {
  (action: Action): void;
}

const updateVariable = (action: VariableAction) => {
  if (action.actionType === "delete") {
    deleteVariable(action.variableId);
  }
};

const updateForLoop = (action: ForLoopTextChange) => {
  const block = getBlockById(action.blockId);

  block.inputList[2].fieldRow[0].setValue(action.changeText);
};

const updateSetupSensorBlockFields = (action: UpdateSetupSensorBlockFields) => {
  const block = getBlockById(action.blockId);
  action.fields
    .filter((field) => block.getField(field.name))
    .forEach((field) => {
      const blocklyField = block.getField(field.name);
      if (blocklyField instanceof Blockly.FieldCheckbox) {
        block.setFieldValue(
          field.value === 1 || field.value === true ? "TRUE" : "FALSE",
          field.name
        );
        return;
      }

      block.setFieldValue(field.value, field.name);
    });
};

const updateSetupSensorBlockLoopField = (
  action: UpdateSetupSensorBlockLoop
) => {
  const block = getBlockById(action.blockId);
  block.setFieldValue(action.loop.toString(), "LOOP");
};

const updateDisableBlock = (action: DisableBlock) => {
  const block = getBlockById(action.blockId);

  if (block.isEnabled()) {
    block.setEnabled(false);
  }

  block.setWarningText(action.warningText);
};

const updateEnableBlock = (action: EnableBlock) => {
  const block = getBlockById(action.blockId);

  if (!block.isEnabled()) {
    block.setEnabled(true);
    block.setWarningText(null);
  }
};

const updateSensorBlockData = (action: SaveSetupSensorData) => {
  const block = getBlockById(action.blockId);

  block.data = action.data;
};

const updateLcdScreenPrintBlock = (action: UpdateLCDScreenPrintBlock) => {
  const block = getBlockById(action.blockId);
  if (action.numberOfRows == 2) {
    block.getInput("ROW_3").setVisible(false);
    block.getInput("ROW_4").setVisible(false);
  } else {
    block.getInput("ROW_3").setVisible(true);
    block.getInput("ROW_4").setVisible(true);
  }
  block.render();
};

const updateLedColor = (action: UpdateLedColor) => {
  const block = getBlockById(action.blockId);
  block.setFieldValue(action.color, "COLOR");
  block.render();
};

const updateMotorBlock = (action: UpdateMultipleComponentSetupBlock) => {
  const block = getBlockByType("motor_setup");
  block.getInput("COMPONENT_2").setVisible(action.numberOfComponents == 2);
  block.render();

  const motorMoveBlocks = getBlocksByName("move_motor");
  motorMoveBlocks.forEach((b) => {
    b.getInput("WHICH_MOTOR").setVisible(action.numberOfComponents == 2);
    b.render();
  });
  const stopMotorBlocks = getBlocksByName("stop_motor");
  stopMotorBlocks.forEach((b) => {
    b.getInput("WHICH_MOTOR").setVisible(action.numberOfComponents == 2);
    b.render();
  });
};

const updateRGBLedColorBlocks = (action: UpdateMultipleComponentSetupBlock) => {
  const block = getBlockByType("rgb_led_setup");
  block.getInput("COMPONENT_2").setVisible(action.numberOfComponents == 2);
  block.render();

  const setLedColorBlocks = getBlocksByName("set_color_led");
  setLedColorBlocks.forEach((b) => {
    b.getInput("WHICH_COMPONENT").setVisible(action.numberOfComponents == 2);
    b.render();
  });

  const setSimpleRgbLedCOlorBlocks = getBlocksByName("set_simple_color_led");
  setSimpleRgbLedCOlorBlocks.forEach((b) => {
    b.getInput("WHICH_COMPONENT").setVisible(action.numberOfComponents == 2);
    b.render();
  });
};

const updateMultipleSetupBlock = (
  action: UpdateMultipleComponentSetupBlock
) => {
  switch (action.componentType) {
    case ArduinoComponentType.MOTOR:
      updateMotorBlock(action);
      break;
    case ArduinoComponentType.LED_COLOR:
      updateRGBLedColorBlocks(action);
      break;
  }
};

const updateFastLedSetAllColorsBlock = (action: UpdateSetAllFastLedBlock) => {
  const block = getBlockById(action.blockId);
  console.log("update blocks");
  for (let row = 1; row <= 12; row += 1) {
    const showAllInRow = row <= action.maxRows;
    block.getInput(`ROW_${row}`).setVisible(showAllInRow);
    for (let col = 1; col <= 12; col += 1) {
      const field = block.getField(`${row}-${col}`);
      if (row === action.maxRows) {
        field.setVisible(col <= action.maxColumnsOnLastRow);
        continue;
      }
      field.setVisible(showAllInRow);
    }
  }
  block.render();
};

const updateButtonIsPressedComments = (action: CommentForButtonBlockAction) => {
  const block = getBlockById(action.blockId);
  block.setCommentText(action.comment);
  block.render();
};

const updaterList: { [key: string]: Updater } = {
  [ActionType.DELETE_VARIABLE]: updateVariable,
  [ActionType.DISABLE_BLOCK]: updateDisableBlock,
  [ActionType.ENABLE_BLOCK]: updateEnableBlock,
  [ActionType.FOR_LOOP_BLOCK_CHANGE]: updateForLoop,
  [ActionType.SETUP_SENSOR_BLOCK_FIELD_UPDATE]: updateSetupSensorBlockFields,
  [ActionType.SETUP_SENSOR_BLOCK_LOOP_FIELD_UPDATE]:
    updateSetupSensorBlockLoopField,
  [ActionType.SETUP_SENSOR_BLOCK_SAVE_DEBUG_DATA]: updateSensorBlockData,
  [ActionType.LCD_SIMPLE_PRINT_CHANGE]: updateLcdScreenPrintBlock,
  [ActionType.UPDATE_LED_COLOR]: updateLedColor,
  [ActionType.UPDATE_MULTIPLE_SETUP_BLOCK]: updateMultipleSetupBlock,
  [ActionType.UPDATE_FASTLED_SET_ALL_COLORS_BLOCK]:
    updateFastLedSetAllColorsBlock,
  [ActionType.UPDATE_COMMENT_FOR_BUTTON_BLOCK]: updateButtonIsPressedComments,
};

export const updater = (action: Action) => {
  if (!updaterList[action.type]) {
    throw new Error("No updater found for action type: " + action.type);
  }

  return updaterList[action.type](action);
};
