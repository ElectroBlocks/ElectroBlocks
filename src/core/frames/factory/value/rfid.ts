import { ValueGenerator } from '../value.factories';
import { findComponent } from '../factory.helpers';
import { RfidState } from '../../arduino-components.state';
import { ArduinoComponentType } from '../../arduino.frame';

export const rfidScannedCard: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<RfidState>(previousState, ArduinoComponentType.RFID)
    .scannedCard;
};

export const rfidTag: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<RfidState>(previousState, ArduinoComponentType.RFID).tag;
};

export const rfidCardNumber: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  return findComponent<RfidState>(previousState, ArduinoComponentType.RFID)
    .cardNumber;
};
