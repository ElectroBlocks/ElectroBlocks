import { SyncComponent, CreateComponent } from '../svg.component';
import { ArduinoComponentType } from '../../frames/arduino.frame';
import { BluetoothState } from '../../frames/arduino-components.state';
import {
  componentToSvgId,
  findSvgElement,
  findArduinoEl,
  createComponentEl,
  addWireConnectionClass,
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
      'WIRE_TX'
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

  positionComponent(
    bluetoothEl,
    arduino,
    draw,
    bluetoothState.txPin,
    'WIRE_TX'
  );
  createWires(
    bluetoothEl,
    arduino,
    draw,
    bluetoothState.rxPin,
    bluetoothState.txPin,
    id
  );

  bluetoothEl.findOne('#MESSAGE_LAYER').hide();
  findSvgElement('HELPER_TEXT', bluetoothEl).hide();
  unHighlightAllPins(bluetoothEl as Element);

  addWireConnectionClass(
    [
      'WIRE_RX',
      'WIRE_TX',
      'GND_BOX',
      '_5V_BOX',
      'HELPER_PIN_VCC',
      'HELPER_PIN_TX',
      'HELPER_PIN_RX',
      'CLOSE',
    ],
    bluetoothEl
  );

  addDraggableEvent(bluetoothEl, arduino, draw);
  registerShowToolTip(bluetoothEl, 'GND_BOX', 'GND');
  registerShowToolTip(bluetoothEl, 'WIRE_RX', 'RX');
  registerShowToolTip(bluetoothEl, 'WIRE_TX', 'TX');
  registerShowToolTip(bluetoothEl, '_5V_BOX', 'VCC');
  registerShowToolTip(bluetoothEl, 'HELPER_PIN_GND', 'GND');
  registerShowToolTip(bluetoothEl, 'HELPER_PIN_VCC', 'VCC');
  registerShowToolTip(bluetoothEl, 'HELPER_PIN_RX', 'RX');
  registerShowToolTip(bluetoothEl, 'HELPER_PIN_TX', 'TX');

  bluetoothEl.findOne('#CLOSE').on('click', (e) => {
    e.stopPropagation();
    findSvgElement('HELPER_TEXT', bluetoothEl).hide();
    unHighlightAllPins(bluetoothEl);
  });
};

const registerShowToolTip = (
  bluetoothEl: Element,
  id: string,
  highlightType: string
) => {
  bluetoothEl.findOne('#' + id).on('click', (e) => {
    e.stopPropagation();
    unHighlightAllPins(bluetoothEl);
    showToolTip(bluetoothEl, highlightType);
  });
};

const createWires = (
  bluetoothEl: Element,
  arduino: Svg | Element,
  draw: Svg,
  rxPin: ARDUINO_UNO_PINS,
  txPin: ARDUINO_UNO_PINS,
  componentId: string
) => {
  createWire(bluetoothEl, rxPin, 'WIRE_RX', arduino, draw, '#ac4cf5', 'rx');

  createWire(bluetoothEl, txPin, 'WIRE_TX', arduino, draw, '#0f5873', 'rx');

  createGroundWire(
    bluetoothEl,
    txPin,
    arduino as Svg,
    draw,
    'GND_BOX',
    componentId,
    'right'
  );

  createPowerWire(
    bluetoothEl,
    txPin,
    arduino as Svg,
    draw,
    '_5V_BOX',
    componentId,
    'right'
  );
};

const unHighlightAllPins = (helpTextEl: Element) => {
  findSvgElement('HELPER_PIN_VCC', helpTextEl).stroke({ width: 0 });
  findSvgElement('HELPER_PIN_GND', helpTextEl).stroke({ width: 0 });
  findSvgElement('HELPER_PIN_TX', helpTextEl).stroke({ width: 0 });
  findSvgElement('HELPER_PIN_RX', helpTextEl).stroke({ width: 0 });

  findSvgElement('WIRE_TX', helpTextEl).stroke({ width: 0 });
  findSvgElement('WIRE_RX', helpTextEl).stroke({ width: 0 });
  findSvgElement('GND_BOX', helpTextEl).stroke({ width: 0 });
  findSvgElement('_5V_BOX', helpTextEl).stroke({ width: 0 });
};

const showToolTip = (bluetooth: Element, pinType: string) => {
  unHighlightAllPins(bluetooth);
  findSvgElement('HELPER_TEXT', bluetooth).show();
  if (pinType === 'GND') {
    findSvgElement('HELPER_PIN_GND', bluetooth).stroke({ width: 4 });
    findSvgElement('GND_BOX', bluetooth).stroke({ width: 2 });
  }

  if (pinType === 'VCC') {
    findSvgElement('HELPER_PIN_VCC', bluetooth).stroke({ width: 4 });
    findSvgElement('_5V_BOX', bluetooth).stroke({ width: 2 });
  }

  if (pinType === 'TX') {
    findSvgElement('HELPER_PIN_TX', bluetooth).stroke({ width: 4 });
    findSvgElement('WIRE_TX', bluetooth).stroke({ width: 2 });
  }

  if (pinType === 'RX') {
    findSvgElement('HELPER_PIN_RX', bluetooth).stroke({ width: 4 });
    findSvgElement('WIRE_RX', bluetooth).stroke({ width: 2 });
  }
};

const getMessage = (message: string) => {
  return message.length > 38 ? message.slice(0, 35) + '...' : message;
};

const resetMessage = (bluetoothEl: Element) => {
  const textBubble = bluetoothEl.findOne('#MESSAGE_LAYER');
  const textLine1 = bluetoothEl.findOne('#MESSAGE_LINE_1') as Text;
  const textLine2 = bluetoothEl.findOne('#MESSAGE_LINE_2') as Text;
  const textLine3 = bluetoothEl.findOne('#MESSAGE_LINE_3') as Text;

  textBubble.hide();
  textLine1.node.textContent = '';
  textLine2.node.textContent = '';
  textLine3.node.textContent = '';
};
