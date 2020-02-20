import 'jest';
import { Workspace, BlockSvg, WorkspaceSvg } from 'blockly';
import * as helpers from '../core/blockly/helpers/workspace.helper';

export const createArduinoAndWorkSpace = (): [WorkspaceSvg, BlockSvg] => {
  const workspace = new Workspace() as WorkspaceSvg;
    jest
      .spyOn(helpers, 'getWorkspace')
      .mockReturnValue(workspace as WorkspaceSvg);
   const arduinoBlock = workspace.newBlock('arduino_loop') as BlockSvg;

  return [workspace, arduinoBlock];
}
