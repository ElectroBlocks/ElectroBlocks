import { createBlock } from '../core/blockly/helpers/block.helper';
import { loadProject } from '../core/blockly/helpers/workspace.helper';
import { onConfirm } from '../help/alerts';

export async function loadNewProjectFile(file): Promise<boolean> {
  if (
    !(await onConfirm(
      `Do you want to load ${file.name}, this will erase everything that you have done.`
    ))
  ) {
    return;
  }

  const reader = new FileReader();

  return new Promise((res, rej) => {
    reader.readAsText(file);
    reader.onload = function (evt) {
      if (evt.target.readyState != 2) return;
      if (evt.target.error) {
        rej(false);
        return;
      }
      try {
        loadProject(evt.target.result as string);
        res(true);
      } catch (e) {
        console.log(e, 'error loading project');

        // creates the arduino loop block
        createBlock('arduino_loop', 50, 150, false);

        rej(false);
      }
    };
  });
}
