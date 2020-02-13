import forLoopChangeText from './forLoopChangeText';
import deleteVariable from './deleteVariable';
import { disableEnableBlocks } from './disableEnableBlocks';
import { saveSensorSetupBlockState } from './saveSensorSetupBlockState';
import { WorkspaceSvg } from 'blockly';
import { changeSensorSetupBlockBecauseLoopDropDownChanged } from './changeSensorSetupBlockBecauseLoopDropDownChanged';
import { changeLoopNumberInSensorBlocks } from './changeLoopNumberInSensorBlocks';
import { checkRightPinSelected } from './checkRightPinSelected';

import codeStore from '../../../stores/code.store';
import { getArduinoCode } from '../helpers/workspace.helper';

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

    // This is to change the count with blocks text from adding or subtracting
    forLoopChangeText();

    // Clean up unused variables
    deleteVariable();

    // Enables or disables blocks
    disableEnableBlocks();

    // Saves the fake sensor loop data in the block
    saveSensorSetupBlockState(event);

    // If the loop dropdown on the blocks change this populates the sensor setup block with the saved data
    changeSensorSetupBlockBecauseLoopDropDownChanged(event);

    // If the loop number in the arduino loop changes and is greater than what is selected in the sensoor block
    // This will adjust sensor setup block to down to match it
    changeLoopNumberInSensorBlocks(event);

    // Checks that all sensors read blocks have a corresponding sensor setup block with that button setup
    // So if a user drags a button setup block to workspace then deletes it but another setup button block is there
    // All the other read blocks should use that button setup block
    checkRightPinSelected(['is_button_pressed'], 'button_setup');
    checkRightPinSelected(['digital_read'], 'digital_read_setup');
    checkRightPinSelected(['analog_read'], 'analog_read_setup');

    // creates arduino c code and updates store with new code
    codeStore.set(getArduinoCode());
  });
};

export default registerEvents;
