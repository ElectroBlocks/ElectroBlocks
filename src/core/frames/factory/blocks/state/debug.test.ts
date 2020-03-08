
import 'jest';
import '../../../../blockly/blocks';
import Blockly, { Workspace, BlockSvg } from "blockly";
import { createArduinoAndWorkSpace, createSetVariableBlockWithValue } from "../../../../../tests/tests.helper";
import { connectToArduinoBlock, getAllBlocks } from '../../../../blockly/helpers/block.helper';
import { VariableTypes } from '../../../../blockly/state/variable.data';
import { BlockEvent } from '../../../../blockly/state/event.data';
import { transformBlock } from '../../../../blockly/transformers/block.transformer';
import { getAllVariables } from '../../../../blockly/helpers/variable.helper';
import { transformVariable } from '../../../../blockly/transformers/variables.transformer';
import { eventToFrameFactory } from '../../../event-to-frame.factory';


describe('factories debug state', () => {

    let workspace: Workspace;

    afterEach(() => {
        workspace.dispose();
    });

    beforeEach(() => {
        [workspace] = createArduinoAndWorkSpace();
    });

    test('should create debug state with all variables and components', () => {
        const debugBlock = workspace.newBlock('debug_block') as BlockSvg;
        connectToArduinoBlock(debugBlock);
        const numberVarBlock = createSetVariableBlockWithValue(workspace, 'var1', VariableTypes.NUMBER, 33);
        connectToArduinoBlock(numberVarBlock);

        const event: BlockEvent = {
            blocks: getAllBlocks().map(transformBlock),
            variables: getAllVariables().map(transformVariable),
            type: Blockly.Events.BLOCK_MOVE,
            blockId: numberVarBlock.id
        };

        const [state1, state2] = eventToFrameFactory(event);

        expect(state2.blockId).toBe(debugBlock.id);
        expect(state2.explanation).toBe('Debug [will pause in Arduino Code.]');
        expect(state1.variables['var1'].value).toBe(33);
    });

})
