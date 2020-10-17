import { writable } from 'svelte/store';
import is_browser from '../helpers/is_browser';

export interface Settings {
  backgroundColor: string;
  touchSkinColor: string;
  ledColor: string;
  customLedColor: boolean;
  maxTimePerMove: number;
}

export const defaultSetting: Settings = {
        backgroundColor: "#d9e4ec",
        touchSkinColor: "#a424d3",
        ledColor: "#AA0000",
        customLedColor: false,
        maxTimePerMove: 1000,
      }

const settings =
  is_browser() && localStorage.getItem("settings")
    ? JSON.parse(localStorage.getItem("settings"))
    : defaultSetting;

// creates the store
const settingsStore = writable<Settings>(settings);

// updates local store with the new settings
settingsStore.subscribe((settings) => {
  if (is_browser()) {
    localStorage.setItem('settings', JSON.stringify(settings));
  }
});



export default {
  subscribe: settingsStore.subscribe,
  set: settingsStore.set,
};
