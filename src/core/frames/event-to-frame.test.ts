import 'jest';
import '../blockly/blocks';
import Blockly, { Workspace, BlockSvg, WorkspaceSvg, Blocks } from 'blockly';
import * as helpers from '../blockly/helpers/workspace.helper';
import { getAllBlocks } from '../blockly/helpers/block.helper';
import _ from 'lodash';
import { BlockEvent } from '../blockly/dto/event.type';
import { transformBlock } from '../blockly/transformers/block.transformer';
import { getAllVariables } from '../blockly/helpers/variable.helper';
import { transformVariable } from '../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from './event-to-frame.factory';
import { ARDUINO_UNO_PINS } from '../blockly/selectBoard';
import { saveSensorSetupBlockData } from '../blockly/actions/factories/saveSensorSetupBlockData';
import { updater } from '../blockly/updater';
import { ArduinoFrame, ArduinoComponentType } from './arduino.frame';
import { RfidState } from './arduino-components.state';

describe('generator', () => {
  let workspace: Workspace;
  let arduinoBlock;

  beforeEach(() => {
    workspace = new Workspace();
    jest
      .spyOn(helpers, 'getWorkspace')
      .mockReturnValue(workspace as WorkspaceSvg);
    arduinoBlock = workspace.newBlock('arduino_loop') as BlockSvg;
  });

  test('should generate zero frames when no blocks other than the loop are present', () => {
    const event: BlockEvent = {
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: Blockly.Events.BLOCK_DELETE,
      blockId: arduinoBlock.id,
    };

    expect(eventToFrameFactory(event)).toEqual([]);
  });
});
