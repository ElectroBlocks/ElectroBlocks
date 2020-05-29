import { writable } from 'svelte/store';
import is_browser from '../helpers/is_browser';

const settings =
  is_browser() && localStorage.getItem('settings')
    ? JSON.parse(localStorage.getItem('settings'))
    : { showSetupBlock: false };

// creates the store
const settingsStore = writable(settings);

// Updates the store to show the arduino setup block
const showSetupBlock = () => {
  settingsStore.update((settings) => {
    return { ...settings, showSetupBlock: true };
  });
};

// Updates the store to hide the arduino setup block
const hideSetupBlock = () => {
  settingsStore.update((settings) => {
    return { ...settings, showSetupBlock: false };
  });
};

// updates local store with the new settings
settingsStore.subscribe((settings) => {
  if (is_browser()) {
    localStorage.setItem('settings', JSON.stringify(settings));
  }
});

export default {
  subscribe: settingsStore.subscribe,
  showSetupBlock,
  hideSetupBlock,
};
