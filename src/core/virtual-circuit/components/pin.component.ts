import { ResetComponent, SyncComponent } from "../svg-sync";
import {
  PositionComponent,
  CreateWire,
  CreateCompenentHook,
} from "../svg-create";

import { PinPicture, PinState } from "../../frames/arduino-components.state";
import _ from "lodash";
import { Element } from "@svgdotjs/svg.js";
import {
  analogDigitalSensorCreate,
  analogDigitalSensorUpdate,
  analogDigitalSensorReset,
  analogDigitalSensorPosition,
  createWireSensors,
} from "./analog-sensor.sync";

export const createPinComponent: CreateCompenentHook<PinState> = (
  state,
  componentEl,
  arduinoEl,
  draw,
  board
) => {
  if (_.isFunction(pinFunctionCreate[state.pinPicture])) {
    return pinFunctionCreate[state.pinPicture](
      state,
      componentEl,
      arduinoEl,
      draw,
      board
    );
  }
  throw new Error("No Create Function Found for pin type " + state.pinPicture);
};

export const positionPinComponent: PositionComponent<PinState> = (
  state,
  componentEl,
  arduinoEl,
  draw,
  board
) => {
  if (_.isFunction(pinPositionFunc[state.pinPicture])) {
    return pinPositionFunc[state.pinPicture](
      state,
      componentEl,
      arduinoEl,
      draw,
      board
    );
  }
  throw new Error("No Create Function Found for pin type " + state.pinPicture);
};

export const updatePinComponent: SyncComponent = (
  state: PinState,
  componentEl,
  draw,
  frame
) => {
  if (_.isFunction(pinFunctionUpdate[state.pinPicture])) {
    return pinFunctionUpdate[state.pinPicture](state, componentEl, draw, frame);
  }
  throw new Error("No Update Function Found for pin type " + state.pinPicture);
};

export const resetPinComponent: ResetComponent = (componentEl: Element) => {
  if (_.isFunction(pinFunctionReset[componentEl.data("picture-type")])) {
    return pinFunctionReset[componentEl.data("picture-type")](componentEl);
  }
  throw new Error(
    "No Reset Function Found for pin type " + componentEl.data("picture-type")
  );
};

export const createDigitalAnalogWire: CreateWire<PinState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id,
  board
) => {
  if (_.isFunction(pinFunctionCreateWire[state.pinPicture])) {
    return pinFunctionCreateWire[state.pinPicture](
      state,
      draw,
      componentEl,
      arduinoEl,
      id,
      board
    );
  }
  throw new Error("No Reset Function Found for pin type " + state.pinPicture);
};

const pinFunctionCreate = {
  [PinPicture.PHOTO_SENSOR]: analogDigitalSensorCreate,
  [PinPicture.SOIL_SENSOR]: analogDigitalSensorCreate,
  [PinPicture.SENSOR]: analogDigitalSensorCreate,
  [PinPicture.TOUCH_SENSOR]: analogDigitalSensorCreate,
};

const pinFunctionUpdate = {
  [PinPicture.PHOTO_SENSOR]: analogDigitalSensorUpdate,
  [PinPicture.SOIL_SENSOR]: analogDigitalSensorUpdate,
  [PinPicture.SENSOR]: analogDigitalSensorUpdate,
  [PinPicture.TOUCH_SENSOR]: analogDigitalSensorUpdate,
};

const pinFunctionReset = {
  [PinPicture.PHOTO_SENSOR]: analogDigitalSensorReset,
  [PinPicture.SOIL_SENSOR]: analogDigitalSensorReset,
  [PinPicture.SENSOR]: analogDigitalSensorReset,
  [PinPicture.TOUCH_SENSOR]: analogDigitalSensorReset,
};

const pinPositionFunc = {
  [PinPicture.PHOTO_SENSOR]: analogDigitalSensorPosition,
  [PinPicture.SOIL_SENSOR]: analogDigitalSensorPosition,
  [PinPicture.SENSOR]: analogDigitalSensorPosition,
  [PinPicture.TOUCH_SENSOR]: analogDigitalSensorPosition,
};

const pinFunctionCreateWire = {
  [PinPicture.PHOTO_SENSOR]: createWireSensors,
  [PinPicture.SOIL_SENSOR]: createWireSensors,
  [PinPicture.SENSOR]: createWireSensors,
  [PinPicture.TOUCH_SENSOR]: createWireSensors,
};
