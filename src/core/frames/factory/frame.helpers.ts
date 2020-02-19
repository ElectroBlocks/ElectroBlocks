import {
  ArduinoState,
  Timeline,
  ArduinoComponentState
} from '../state/arduino.state';

import _ from 'lodash';

export const createArduinoState = (
  blockId: string,
  timeline: Timeline,
  newComponent: ArduinoComponentState,
  explanation: string,
  previousState: ArduinoState = undefined,
  txLedOn = false,
  rxLedOn = false,
  delay = 0
): ArduinoState => {
  const variables = previousState ? { ...previousState.variables } : {};
  const previousComponents = previousState ? [...previousState.components] : [];

  const components = [
    ...previousComponents.filter(
      (c) =>
        c.type !== newComponent.type && _.isEqual(c.pins, newComponent.pins)
    ),
    newComponent
  ];

  return {
    blockId,
    sendMessage: '',
    timeLine: { ...timeline },
    variables,
    txLedOn,
    rxLedOn,
    components,
    explanation,
    delay,
    powerLedOn: true
  };
};
