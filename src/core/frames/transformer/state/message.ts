import { BlockToFrameTransformer } from '../block-to-frame.transformer';
import { ArduinoMessageState } from '../../arduino-components.state';
import { BluetoothSensor } from '../../../blockly/dto/sensors.type';
import { arduinoStateByComponent } from '../frame-transformer.helpers';
import { ArduinoComponentType } from '../../arduino.frame';
import { getInputValue } from '../block-to-value.factories';
import _ from 'lodash';

export const messageSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const messageDatum = JSON.parse(block.metaData) as BluetoothSensor[];
  const messbtnData = messageDatum.find((d) => d.loop == 1);

  const messageComponent: ArduinoMessageState = {
    pins: block.pins,
    hasMessage: messbtnData.receiving_message,
    message: messbtnData.message,
    sendMessage: '',
    type: ArduinoComponentType.MESSAGE,
  };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      messageComponent,
      'Setting up Arduino messages.',
      previousState
    ),
  ];
};

export const arduinoSendMessage: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const message = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    'MESSAGE',
    '',
    previousState
  );

  const components = previousState ? _.cloneDeep(previousState.components) : [];

  const replaceVariables = previousState ? { ...previousState.variables } : {};

  return [
    {
      blockId: block.id,
      sendMessage: message,
      timeLine: { ...timeline },
      variables: replaceVariables,
      txLedOn: true,
      rxLedOn: false,
      components,
      explanation: `Arduino sending message: "${message}".`,
      delay: 0,
      powerLedOn: true,
    },
  ];
};
