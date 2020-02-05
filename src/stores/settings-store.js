import { writable } from 'svelte/store';
import is_browser from '../services/is_browser';
const defualtSettings = {
    showSetupBlock: true
};
// creates the store
const settingsStore = writable(defualtSettings);
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
const refreshSettingsWithLocalStorage = () => {
    if (is_browser() && localStorage.getItem('settings')) {
        settingsStore.set(JSON.parse(localStorage.getItem('settings') || JSON.stringify(defualtSettings)));
    }
};
export default {
    subscribe: settingsStore.subscribe,
    showSetupBlock,
    hideSetupBlock,
    refreshSettingsWithLocalStorage
};
