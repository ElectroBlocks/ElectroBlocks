import settingsStore from '../../../stores/settings.store';
import { MicrocontrollerType } from '../../microcontroller/microcontroller';
import { get } from 'svelte/store';

export const getBoardType = (): string => {
  const board = localStorage.getItem("selectedBoard");
  console.log("✅ getBoardType() returned:", board);  
  return board || "ARDUINO_UNO"; 
};
