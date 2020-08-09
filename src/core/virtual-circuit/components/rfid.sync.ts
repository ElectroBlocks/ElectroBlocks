import { CreateComponent, SyncComponent } from '../svg.component';
import { RfidState } from '../../frames/arduino-components.state';
import {
  componentToSvgId,
  findArduinoEl,
  createComponentEl,
} from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';

import rfidSvgString from '../svgs/rfid/rfid.svg';
import { positionComponent } from '../svg-position';
import { addDraggableEvent } from '../component-events.helpers';
import { createWire, createPowerWire, createGroundWire } from '../wire';

export const createRfid: CreateComponent = (state, frame, draw) => {
  const rfidState = state as RfidState;

  const id = componentToSvgId(rfidState);
  let rfidEl = draw.findOne('#' + id) as Element;
  const arduinoEl = findArduinoEl(draw);

  if (rfidEl) {
    return;
  }

  rfidEl = createComponentEl(draw, state, rfidSvgString);
  (window as any).rfidEl = rfidEl;
  positionComponent(rfidEl, arduinoEl, draw, rfidState.txPin, 'PIN_TX');
  rfidEl.x(rfidEl.x() + 100);
  addDraggableEvent(rfidEl, arduinoEl, draw);
  createWires(rfidEl, rfidState, draw, id, arduinoEl);
  updateComponent(rfidEl, rfidState);
};

export const updateRfid: SyncComponent = (state, frame, draw) => {
  const rfidState = state as RfidState;

  const id = componentToSvgId(rfidState);
  let rfidEl = draw.findOne('#' + id) as Element;
  updateComponent(rfidEl, rfidState);
};

const updateComponent = (rfidEl: Element, state: RfidState) => {
  if (!state.scannedCard) {
    rfidEl.findOne('#RFID').hide();
    return;
  }
  rfidEl.findOne('#RFID').show();
  rfidEl.findOne(
    '#CARD_NUMBER_TEXT'
  ).node.innerHTML = `Card #: "${state.cardNumber}"`;
  rfidEl.findOne('#TAG_TEXT').node.innerHTML = `Tag #: "${state.tag}"`;
};

const createWires = (
  rfidEl: Element,
  state: RfidState,
  draw: Svg,
  id: string,
  arduionEl: Element
) => {
  createWire(
    rfidEl,
    state.txPin,
    'PIN_TX',
    arduionEl,
    draw,
    '#dda824',
    'tx-pin'
  );
  createPowerWire(rfidEl, state.txPin, arduionEl as Svg, draw, id, 'left');
  createGroundWire(rfidEl, state.txPin, arduionEl as Svg, draw, id, 'left');
};
