import { writable } from 'svelte/store';
export var WindowType;
(function (WindowType) {
    WindowType["NONE"] = "none";
    WindowType["MAIN"] = "main";
    WindowType["SIDE"] = "side";
})(WindowType || (WindowType = {}));
const store = writable({ type: WindowType.NONE, time: new Date().getTime() });
export const resizeStore = {
    subscribe: store.subscribe,
    mainWindow: () => {
        store.set({ type: WindowType.MAIN, time: new Date().getTime() });
    },
    sideWindow: () => {
        store.set({ type: WindowType.SIDE, time: new Date().getTime() });
    }
};
