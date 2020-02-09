import { writable } from 'svelte/store';

export enum WindowType {
  NONE = 'none',
  MAIN = 'main',
  SIDE = 'side'
}

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
