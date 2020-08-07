import {
  SyncComponent,
  CreateComponent,
  ResetComponent,
} from '../svg.component';
import { Element, Svg, Text } from '@svgdotjs/svg.js';
import {
  ArduinoComponentType,
  ArduinoComponentState,
} from '../../frames/arduino.frame';
import { PinState, PinPicture } from '../../frames/arduino-components.state';
import {
  componentToSvgId,
  findArduinoEl,
  createComponentEl,
} from '../svg-helpers';
import analogdigitalSvgString from '../svgs/analogdigital/digital_analog_write.svg';
import { positionComponent } from '../svg-position';
import { ANALOG_PINS, ARDUINO_UNO_PINS } from '../../blockly/selectBoard';
import { createGroundWire, createWire, updateWires } from '../wire';
import { addDraggableEvent } from '../component-events.helpers';

export const digitalAnalogWritePinReset: ResetComponent = (
  componentEl: Element
) => {
  const pinText = componentEl.findOne('#STATE_TEXT') as Text;
  pinText.node.innerHTML = 'OFF';
  componentEl.findOne('#RAYS').hide();
  (componentEl.findOne('#LIGHT_BULB') as Element).opacity(0);
};

export const digitalAnanlogWritePinCreate: CreateComponent = (
  state,
  frame,
  draw
) => {
  const pinState = state as PinState;
  const id = componentToSvgId(pinState);
  let componentEl = draw.findOne('#' + id) as Element;
  const arduino = findArduinoEl(draw);

  if (componentEl) {
    return;
  }

  componentEl = createComponentEl(draw, state, analogdigitalSvgString);
  componentEl.data('picture-type', pinState.pinPicture);
  componentEl.data('pin_number', pinState.pin);
  (window as any).digitalAnalogWriteEl = componentEl;

  addDraggableEvent(componentEl, arduino, draw);
  positionComponent(componentEl, arduino, draw, pinState.pin, 'POWER');
  if (ANALOG_PINS.includes(pinState.pin)) {
    componentEl.x(componentEl.x() + 30);
  }
  createWires(componentEl, pinState.pin, arduino as Svg, draw, id);

  componentEl.findOne('title').node.innerHTML =
    pinState.pinPicture === PinPicture.LED_ANALOG_WRITE
      ? 'PIN DIGITAL WRITE'
      : 'PIN ANALOG WRITE';
  setPinText(pinState.pin, componentEl);
};

export const digitalAnalogWritePinSync: SyncComponent = (
  state,
  frame,
  draw
) => {
  const pinState = state as PinState;

  const id = componentToSvgId(state);
  let pinEl = draw.findOne('#' + id) as Element;
  if (!pinEl) {
    return;
  }
  const pinText = pinEl.findOne('#STATE_TEXT') as Text;

  if (pinState.pinPicture === PinPicture.LED_DIGITAL_WRITE) {
    if (pinState.state === 1) {
      pinText.node.innerHTML = 'ON';
      pinEl.findOne('#RAYS').show();
      pinEl.findOne('#LIGHT_BULB').show();
      (pinEl.findOne('#LIGHT_BULB') as Element).opacity(1);
    } else {
      pinText.node.innerHTML = 'OFF';
      (pinEl.findOne('#LIGHT_BULB') as Element).opacity(0);
      pinEl.findOne('#RAYS').hide();
    }
  }

  if (pinState.pinPicture === PinPicture.LED_ANALOG_WRITE) {
    const pinText = pinEl.findOne('#STATE_TEXT') as Text;
    pinText.node.innerHTML = pinState.state.toString();
    pinEl.findOne('#RAYS').show();
    pinEl.findOne('#LIGHT_BULB').show();

    (pinEl.findOne('#RAYS') as Element).opacity(pinState.state / 255);
    (pinEl.findOne('#LIGHT_BULB') as Element).opacity(pinState.state / 255);
  }

  pinText.cx(16);
};

const createWires = (
  componentEl: Element,
  pin: ARDUINO_UNO_PINS,
  arduino: Svg,
  draw: Svg,
  componentId: string
) => {
  createGroundWire(componentEl, pin, arduino, draw, componentId, 'right');
  createWire(componentEl, pin, 'POWER', arduino, draw, '#FF0000', 'POWER');
};

const setPinText = (pin: ARDUINO_UNO_PINS, componentEl: Element) => {
  const pinText = componentEl.findOne('#PIN_TEXT') as Text;
  pinText.node.innerHTML = pin;
  if (ANALOG_PINS.includes(pin)) {
    pinText.x(-10);
    return;
  }

  if (
    [
      ARDUINO_UNO_PINS.PIN_10,
      ARDUINO_UNO_PINS.PIN_11,
      ARDUINO_UNO_PINS.PIN_12,
    ].includes(pin)
  ) {
    pinText.x(-8);
  }
};
