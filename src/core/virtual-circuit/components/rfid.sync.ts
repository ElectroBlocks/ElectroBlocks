import { SyncComponent, ResetComponent } from '../svg-sync';
import { CreateComponentHook, CreateWire } from '../svg-create';

import { RfidState } from '../../frames/arduino-components.state';
import { componentToSvgId } from '../svg-helpers';
import { Element, Svg } from '@svgdotjs/svg.js';

import { positionComponent } from '../svg-position';
import { createWire, createPowerWire, createGroundWire } from '../wire';

export const createRfid: CreateComponentHook<RfidState> = (
  state,
  rfidEl,
  arduinoEl,
  draw
) => {
  positionComponent(rfidEl, arduinoEl, draw, state.txPin, 'PIN_TX');
  rfidEl.x(rfidEl.x() + 100);
};

export const updateRfid: SyncComponent = (state, draw) => {
  const rfidState = state as RfidState;

  const id = componentToSvgId(rfidState);
  let rfidEl = draw.findOne('#' + id) as Element;
  updateComponent(rfidEl, rfidState);
};

export const resetRfid: ResetComponent = (rfidEl: Element) => {
  rfidEl.findOne('#RFID').hide();
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

export const createWiresRfid: CreateWire<RfidState> = (
  state,
  draw,
  rfidEl,
  arduinoEl,
  id
) => {
  createWire(
    rfidEl,
    state.txPin,
    'PIN_TX',
    arduinoEl,
    draw,
    '#dda824',
    'tx-pin'
  );
  createPowerWire(rfidEl, state.txPin, arduinoEl as Svg, draw, id, 'left');
  createGroundWire(rfidEl, state.txPin, arduinoEl as Svg, draw, id, 'left');
};
