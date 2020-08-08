import {
  CreateComponent,
  ResetComponent,
  SyncComponent,
} from '../svg.component';
import {
  PinPicture,
  PinState,
  PIN_TYPE,
} from '../../frames/arduino-components.state';
import {
  digitalAnanlogWritePinCreate,
  digitalAnalogWritePinReset,
  digitalAnalogWritePinSync,
} from './digitalanalogwritepin.sync';
import { ledCreate, resetLed, updateLed } from './led.sync';
import { ArduinoComponentType } from '../../frames/arduino.frame';
import _ from 'lodash';
import { Element } from '@svgdotjs/svg.js';
import {
  analogDigitalSensorCreate,
  analogDigitalSensorUpdate,
} from './analog-sensor.sync';
import { touchSensorCreate, touchSensorUpdate } from './touch-sensor.sync';

export const createPinComponent: CreateComponent = (
  state: PinState,
  frame,
  draw
) => {
  if (_.isFunction(pinFunctionCreate[state.pinPicture])) {
    return pinFunctionCreate[state.pinPicture](state, frame, draw);
  }
  throw new Error('No Create Function Found for pin type ' + state.pinPicture);
};

export const updatePinComponent: SyncComponent = (
  state: PinState,
  frame,
  draw
) => {
  if (_.isFunction(pinFunctionUpdate[state.pinPicture])) {
    return pinFunctionUpdate[state.pinPicture](state, frame, draw);
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
};
