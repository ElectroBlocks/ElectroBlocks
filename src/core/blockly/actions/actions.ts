import { ArduinoComponentType } from "../../frames/arduino.frame";

export enum ActionType {
  FOR_LOOP_BLOCK_CHANGE = "FOR_LOOP_CHANGE",
  LCD_SIMPLE_PRINT_CHANGE = "LCD_SIMPLE_PRINT_CHANGE",
  SETUP_SENSOR_BLOCK_FIELD_UPDATE = "SETUP_SENSOR_BLOCK_FIELD_UPDATE",
  SETUP_SENSOR_BLOCK_LOOP_FIELD_UPDATE = "SETUP_SENSOR_BLOCK_LOOP_FIELD_UPDATE",
  SETUP_SENSOR_BLOCK_SAVE_DEBUG_DATA = "SETUP_SENSOR_BLOCK_SAVE_DEBUG_DATA",
  DISABLE_BLOCK = "DISABLE_BLOCK",
  ENABLE_BLOCK = "ENABLE_BLOCK",
  DELETE_VARIABLE = "DELETE_VARIABLE",
  UPDATE_LED_COLOR = "UPDATE_LED_COLOR",
  UPDATE_MULTIPLE_SETUP_BLOCK = "UPDATE_MULTIPLE_SETUP_BLOCK",
  UPDATE_FASTLED_SET_ALL_COLORS_BLOCK = "UPDATE_FASTLED_SET_ALL_COLORS_BLOCK",
  UPDATE_COMMENT_FOR_BUTTON_BLOCK = "UPDATE_COMMENT_FOR_BUTTON_BLOCK",
}

export interface Action {
  type: ActionType;
}

export interface CommentForButtonBlockAction extends Action {
  comment: string;
  blockId: string;
}

export interface BlockAction extends Action {
  blockId: string;
}

export interface VariableAction extends Action {
  variableId: string;
  actionType: "delete";
}

export interface ForLoopTextChange extends BlockAction {
  changeText: string;
}

export interface UpdateComponentSetupBlock extends BlockAction {
  numberOfComponents: number;
  componentType: ArduinoComponentType;
}

export interface UpdateSetAllFastLedBlock extends BlockAction {
  maxLeds: number;
  maxRows: number;
  maxColumnsOnLastRow: number;
}

export interface UpdateLCDScreenPrintBlock extends BlockAction {
  numberOfRows: number;
}

export interface UpdateSetupSensorBlockFields extends BlockAction {
  fields: Array<{ name: string; value: any }>;
}

export interface UpdateLedColor extends BlockAction {
  color: string;
}

export interface UpdateSetupSensorBlockLoop extends BlockAction {
  loop: number;
}

export interface SaveSetupSensorData extends BlockAction {
  data: string;
}

export interface DisableBlock extends BlockAction {
  warningText: string;
  stopCompiling: boolean;
}

export interface EnableBlock extends BlockAction {}
