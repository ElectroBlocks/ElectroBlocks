import { StateGenerator } from '../../state.factories';
import { LCDScreenState } from '../../../state/arduino-components.state';
import { findFieldValue } from '../../../../blockly/helpers/block-data.helper';
import { ArduinoComponentType } from '../../../state/arduino.state';
import { arduinoStateByComponent } from '../../factory.helpers';
import _ from 'lodash';
import { getInputValue } from '../../value.factories';

export const lcdScreenSetup: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const rows = findFieldValue(block, 'SIZE') === '20 x 4' ? 4 : 2;
  const columns = findFieldValue(block, 'SIZE') === '20 x 4' ? 20 : 16;

  const lcdState: LCDScreenState = {
    pins: block.pins,
    rows,
    columns,
    type: ArduinoComponentType.LCD_SCREEN,
    memoryType: findFieldValue(block, 'MEMORY_TYPE'),
    blink: { row: 0, column: 0, blinking: false },
    backLightOn: true,
    rowsOfText: []
  };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      lcdState,
      'Setting up LCD Screen.',
      previousState
    )
  ];
};

export const lcdSimplePrint: StateGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const lcdState = _.cloneDeep(
    previousState.components.find(
      (c) => c.type == ArduinoComponentType.LCD_SCREEN
    )
  ) as LCDScreenState;

  const rows = _.range(1, 5).map((i) => {
    return getInputValue(
      blocks,
      block,
      variables,
      timeline,
      'ROW_' + i,
      '',
      previousState
    );
  });

  const delay = getInputValue(
    blocks,
    block,
    variables,
    timeline,
    'DELAY',
    1,
    previousState
  );

  const newComponent: LCDScreenState = {
    ...lcdState,
    rowsOfText: rows
  };

  return [
    arduinoStateByComponent(
      block.id,
      timeline,
      newComponent,
      `Printing message for ${delay.toFixed(2)} seconds.`,
      previousState,
      false,
      false,
      delay * 1000
    )
  ];
};
