import _ from 'lodash';
import getToolBoxString from './getToolBoxString';
import { updateToolbox } from '../../blockly/helpers/workspace.helper';

const toolboxKey = 'blockly_tool_box';

/**
 * Saves a toolbox
 */
const saveToolBox = (entries: ToolBoxEntries[]) => {
  updateToolbox(getToolBoxString(entries));

  return localStorage.setItem(toolboxKey, JSON.stringify(entries));
};

/**
 * Fetches the toolbox entries
 */
const fetchToolBox = (): ToolBoxEntries[] => {
  if (_.isEmpty(localStorage.getItem(toolboxKey))) {
    saveToolBox(defaultToolbox);
  }
  return JSON.parse(localStorage.getItem(toolboxKey) || '');
};

export interface ToolBoxEntries {
  name: string;
  show: boolean;
}

const defaultToolbox: ToolBoxEntries[] = [
  { name: 'Logic', show: true },
  { name: 'Loops', show: true },
  { name: 'List', show: true },
  { name: 'Variables', show: true },
  { name: 'Functions', show: true },
  { name: 'Color', show: true },
  { name: 'Math', show: true },
  { name: 'Text', show: true },
  { name: 'Bluetooth', show: true },
  { name: 'Buttons', show: true },
  { name: 'Debug', show: true },
  { name: 'Message', show: true },
  { name: 'Analog', show: true },
  { name: 'Digital', show: true },
  { name: 'Time', show: true },
  { name: 'LCD Screen', show: true },
  { name: 'Led', show: true },
  { name: 'Led Light Strip', show: true },
  { name: 'Led Matrix', show: true },
  { name: 'Motor / Servo', show: true },
  { name: 'IR Remote', show: true },
  { name: 'Motion', show: true },
  { name: 'RFID', show: true },
  { name: 'Temp', show: true }
];

export { saveToolBox, fetchToolBox };
