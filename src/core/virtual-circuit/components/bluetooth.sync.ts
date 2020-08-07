import { SyncComponent, CreateComponent } from '../svg.component';
import { ArduinoComponentType } from '../../frames/arduino.frame';
import { BluetoothState } from '../../frames/arduino-components.state';
import {
  componentToSvgId,
  findSvgElement,
  findArduinoEl,
  createComponentEl,
} from '../svg-helpers';
import { Element, Svg, Text } from '@svgdotjs/svg.js';
import { positionComponent } from '../svg-position';
import {
  updateWires,
  createWire,
  createGroundWire,
  createPowerWire,
} from '../wire';

import bluetoothSvg from '../svgs/bluetooth/bluetooth.svg';
import { ARDUINO_UNO_PINS } from '../../blockly/selectBoard';
import { addDraggableEvent } from '../component-events.helpers';

export const bluetoothUpdate: SyncComponent = (state, frame, draw) => {
  const bluetoothState = state as BluetoothState;
  const id = componentToSvgId(bluetoothState);
  let bluetoothEl = draw.findOne('#' + id) as Element;
  if (!bluetoothEl) {
    console.error('bluetooth id not found: ' + id);
    return;
  }

  const textBubble = bluetoothEl.findOne('#MESSAGE_LAYER');
  const textLine1 = bluetoothEl.findOne('#MESSAGE_LINE_1') as Text;
  const textLine2 = bluetoothEl.findOne('#MESSAGE_LINE_2') as Text;
  const textLine3 = bluetoothEl.findOne('#MESSAGE_LINE_3') as Text;

  if (
    bluetoothState.sendMessage.length > 0 &&
    frame.blockName == 'bluetooth_send_message'
  ) {
    // only display if we are on the bluetooth block that is sending the message.
    const message = getMessage(bluetoothState.sendMessage);
    textLine1.node.textContent = 'Send Message';
    textLine2.node.textContent = message.slice(0, 19);
    textLine3.node.textContent = message.slice(19);
    textBubble.show();
    return;
  }
  if (bluetoothState.hasMessage) {
    // if the bluetooth has message display the message
    const message = getMessage(bluetoothState.message);
    textLine1.node.textContent = 'Incoming Message:';
    textLine2.node.textContent = message.slice(0, 19);
    textLine3.node.textContent = message.slice(19);
    textBubble.show();
    return;
  }

  textBubble.hide();
};

export const bluetoothCreate: CreateComponent = (state, frame, draw) => {
  const bluetoothState = state as BluetoothState;

  const id = componentToSvgId(bluetoothState);
  let bluetoothEl = draw.findOne('#' + id) as Element;
  const arduino = findArduinoEl(draw);
  if (bluetoothEl) {
    positionComponent(
      bluetoothEl,
      arduino,
      draw,
      bluetoothState.txPin,
      'PIN_TX'
    );
    createWires(
      bluetoothEl,
      arduino,
      draw,
      bluetoothState.rxPin,
      bluetoothState.txPin,
      id
    );
    updateWires(bluetoothEl, draw, arduino as Svg);
    (bluetoothEl as any).draggable().on('dragmove', (e) => {
      updateWires(bluetoothEl, draw, arduino as Svg);
    });
    return;
  }

  bluetoothEl = createComponentEl(draw, bluetoothState, bluetoothSvg);
  (window as any).bluetooth = bluetoothEl;

  positionComponent(bluetoothEl, arduino, draw, bluetoothState.txPin, 'PIN_TX');
  createWires(
    bluetoothEl,
    arduino,
    draw,
    bluetoothState.rxPin,
    bluetoothState.txPin,
    id
  );

  bluetoothEl.findOne('#MESSAGE_LAYER').hide();
  addDraggableEvent(bluetoothEl, arduino, draw);
};

const createWires = (
  bluetoothEl: Element,
  arduino: Svg | Element,
  draw: Svg,
  rxPin: ARDUINO_UNO_PINS,
  txPin: ARDUINO_UNO_PINS,
  componentId: string
) => {
  createWire(bluetoothEl, rxPin, 'PIN_RX', arduino, draw, '#ac4cf5', 'rx');

  createWire(bluetoothEl, txPin, 'PIN_TX', arduino, draw, '#0f5873', 'tx');

  createGroundWire(
    bluetoothEl,
    txPin,
    arduino as Svg,
    draw,
    componentId,
    'right'
  );

  createPowerWire(
    bluetoothEl,
    txPin,
    arduino as Svg,
    draw,
    componentId,
    'right'
  );
};

const getMessage = (message: string) => {
  return message.length > 38 ? message.slice(0, 35) + '...' : message;
};
