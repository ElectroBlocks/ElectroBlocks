import updateForLoopText from '../actions/factories/updateForLoopText';
import deleteVariable from './deleteVariable';
import { disableEnableBlocks } from './disableEnableBlocks';
import { saveSensorSetupBlockState } from './saveSensorSetupBlockState';
import { WorkspaceSvg } from 'blockly';

import codeStore from '../../../stores/code.store';
import { getArduinoCode } from '../helpers/workspace.helper';

import { getSensorData } from '../../state-generator/sensor-data';
import { getAllBlocks } from '../helpers/block.helper';
import { transformBlock } from '../transformers/block.transformer';

const registerEvents = (workspace: WorkspaceSvg) => {
  workspace.addChangeListener(async (event) => {
    console.log(event, 'blockly event');
    if (
      event.element === 'disabled' ||
      // Means a modal is opening
      event.element === 'warningOpen' ||
      // Does not have anything to do with a block
      event.blockId === null ||
      event.element === 'click' ||
      event.element === 'selected'
    ) {
      return;
    }


  });
};

export default registerEvents;
