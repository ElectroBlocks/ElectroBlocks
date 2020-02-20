import { StateGenerator } from './state.factories';
import { ArduinoComponentType } from '../state/arduino.state';
import { getSensorData } from '../../blockly/transformers/sensor-data.transformer';
import { RfidState } from '../state/arduino-components.state';
import { RFIDSensor } from '../../blockly/state/sensors.state';
import { createArduinoState } from './factory.helpers';
import { findFieldValue } from '../../blockly/helpers/block-data.helper';

export const rfidSetup: StateGenerator = (
  blocks,
  block,
  timeline,
  previousState
) => {
  const sensorData = getSensorData(blocks);

  const rfidSensorLoop1 = sensorData.find(
    // loop should always be 1 because it's a pre setup block
    // Meaning it's never in the loop or setup
    (s) => s.blockName === block.blockName && s.loop === 1
  ) as RFIDSensor;

  const rfidComponent: RfidState = {
    pins: block.pins,
    type: ArduinoComponentType.RFID,
    rxPin: findFieldValue(block,'RX'),
    txPin: findFieldValue(block,'TX'),
    scannedCard: rfidSensorLoop1.scanned_card,
    tag: rfidSensorLoop1.tag,
    cardNumber: rfidSensorLoop1.card_number
  };

  return [
    createArduinoState(
      block.id,
      timeline,
      rfidComponent,
      'Setting up RFID.',
      previousState
    )
  ];
};
