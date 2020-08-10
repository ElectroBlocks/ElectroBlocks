import { ResetComponent, SyncComponent } from '../svg-sync';
import { CreateComponentHook, CreateWire } from '../svg-create';

import { PinPicture, PinState } from '../../frames/arduino-components.state';
import {
  digitalAnanlogWritePinCreate,
  digitalAnalogWritePinReset,
  digitalAnalogWritePinSync,
  createWiresDigitalAnalogWrite,
} from './digitalanalogwritepin.sync';
import { ledCreate, resetLed, updateLed, createWiresLed } from './led.sync';
import _ from 'lodash';
import { Element } from '@svgdotjs/svg.js';
import {
  analogDigitalSensorCreate,
  analogDigitalSensorUpdate,
  analogDigitalSensorReset,
  createWireSensors,
} from './analog-sensor.sync';

export const createPinComponent: CreateComponentHook<PinState> = (
  state: PinState,
  componentEl,
  arduinoEl,
  draw
) => {
  if (_.isFunction(pinFunctionCreate[state.pinPicture])) {
    return pinFunctionCreate[state.pinPicture](
      state,
      componentEl,
      arduinoEl,
      draw
    );
  }
  throw new Error('No Create Function Found for pin type ' + state.pinPicture);
};

export const updatePinComponent: SyncComponent = (
  state: PinState,
  draw,
  frame
) => {
  if (_.isFunction(pinFunctionUpdate[state.pinPicture])) {
    return pinFunctionUpdate[state.pinPicture](state, draw, frame);
  }
  throw new Error('No Update Function Found for pin type ' + state.pinPicture);
};

export const resetPinComponent: ResetComponent = (componentEl: Element) => {
  if (_.isFunction(pinFunctionReset[componentEl.data('picture-type')])) {
    return pinFunctionReset[componentEl.data('picture-type')](componentEl);
  }
  throw new Error(
    'No Reset Function Found for pin type ' + componentEl.data('picture-type')
  );
};

export const createDigitalAnalogWire: CreateWire<PinState> = (
  state,
  draw,
  componentEl,
  arduinoEl,
  id
) => {
  if (_.isFunction(pinFunctionCreateWire[componentEl.data('picture-type')])) {
    return pinFunctionCreateWire[componentEl.data('picture-type')](
      state,
      draw,
      componentEl,
      arduinoEl,
      id
    );
  }
  throw new Error(
    'No Reset Function Found for pin type ' + componentEl.data('picture-type')
  );
};

const pinFunctionCreate = {
  [PinPicture.LED_ANALOG_WRITE]: digitalAnanlogWritePinCreate,
  [PinPicture.LED_DIGITAL_WRITE]: digitalAnanlogWritePinCreate,
  [PinPicture.LED]: ledCreate,
  [PinPicture.PHOTO_SENSOR]: analogDigitalSensorCreate,
  [PinPicture.SOIL_SENSOR]: analogDigitalSensorCreate,
  [PinPicture.SENSOR]: analogDigitalSensorCreate,
  [PinPicture.TOUCH_SENSOR]: analogDigitalSensorCreate,
};

const pinFunctionUpdate = {
  [PinPicture.LED_ANALOG_WRITE]: digitalAnalogWritePinSync,
  [PinPicture.LED_DIGITAL_WRITE]: digitalAnalogWritePinSync,
  [PinPicture.LED]: updateLed,
  [PinPicture.PHOTO_SENSOR]: analogDigitalSensorUpdate,
  [PinPicture.SOIL_SENSOR]: analogDigitalSensorUpdate,
  [PinPicture.SENSOR]: analogDigitalSensorUpdate,
  [PinPicture.TOUCH_SENSOR]: analogDigitalSensorUpdate,
};

const pinFunctionReset = {
  [PinPicture.LED_ANALOG_WRITE]: digitalAnalogWritePinReset,
  [PinPicture.LED_DIGITAL_WRITE]: digitalAnalogWritePinReset,
  [PinPicture.LED]: resetLed,
  [PinPicture.PHOTO_SENSOR]: analogDigitalSensorReset,
  [PinPicture.SOIL_SENSOR]: analogDigitalSensorReset,
  [PinPicture.SENSOR]: analogDigitalSensorReset,
  [PinPicture.TOUCH_SENSOR]: analogDigitalSensorReset,
};

const pinFunctionCreateWire = {
  [PinPicture.LED_ANALOG_WRITE]: createWiresDigitalAnalogWrite,
  [PinPicture.LED_DIGITAL_WRITE]: createWiresDigitalAnalogWrite,
  [PinPicture.LED]: createWiresLed,
  [PinPicture.PHOTO_SENSOR]: createWireSensors,
  [PinPicture.SOIL_SENSOR]: createWireSensors,
  [PinPicture.SENSOR]: createWireSensors,
  [PinPicture.TOUCH_SENSOR]: createWireSensors,
};
