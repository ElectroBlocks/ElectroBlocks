import { writable } from 'svelte/store';
import is_browser from '../helpers/is_browser';

const settings =
  is_browser() && localStorage.getItem('settings')
    ? JSON.parse(localStorage.getItem('settings'))
    : { showArduino: true };

// creates the store
const settingsStore = writable(settings);

// updates local store with the new settings
settingsStore.subscribe((settings) => {
  if (is_browser()) {
    localStorage.setItem('settings', JSON.stringify(settings));
  }
});

const showArduino = (show: boolean) => {
  settingsStore.update((settings) => {
    settings['showArduino'] = show;
    return settings;
  });
};

export default {
  subscribe: settingsStore.subscribe,
  showArduino,
};
