import { StateGenerator } from '../state.factories';
import { ArduinoComponentType } from '../../arduino.frame';
import { RfidState } from '../../arduino-components.state';
import { RFIDSensor } from '../../../blockly/dto/sensors.data';
import { arduinoStateByComponent } from '../factory.helpers';
import { findFieldValue } from '../../../blockly/helpers/block-data.helper';

export const rfidSetup: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const sensorData = JSON.parse(block.metaData) as RFIDSensor[];

  const rfidSensorLoop1 = sensorData.find((s) => s.loop === 1) as RFIDSensor;

  const rfidComponent: RfidState = {
    pins: block.pins,
    type: ArduinoComponentType.RFID,
    rxPin: findFieldValue(block, 'RX'),
    txPin: findFieldValue(block, 'TX'),
    scannedCard: rfidSensorLoop1.scanned_card,
    tag: rfidSensorLoop1.tag,
    cardNumber: rfidSensorLoop1.card_number,
  };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      rfidComponent,
      'Setting up RFID.',
      previousState
    ),
  ];
};
