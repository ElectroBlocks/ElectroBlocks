import { SyncComponent, ResetComponent } from '../svg-sync';
import { PositionComponent, CreateWire } from '../svg-create';

import { RfidState } from '../../frames/arduino-components.state';
import { Element, Svg } from '@svgdotjs/svg.js';

import { positionComponent } from '../svg-position';
import { createWire, createPowerWire, createGroundWire } from '../wire';

export const positionRfid: PositionComponent<RfidState> = (
  state,
  rfidEl,
  arduinoEl,
  draw
) => {
  positionComponent(rfidEl, arduinoEl, draw, state.txPin, 'PIN_TX');
  rfidEl.x(rfidEl.x() + 100);
};

export const updateRfid: SyncComponent = (state: RfidState, rfidEl) => {
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

export const resetRfid: ResetComponent = (rfidEl: Element) => {
  rfidEl.findOne('#RFID').hide();
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
