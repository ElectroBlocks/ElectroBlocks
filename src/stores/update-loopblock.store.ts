import { writable } from 'svelte/store';

const updateLoopBlockStore = writable(1);

export default {
  subscribe: updateLoopBlockStore.subscribe,
  update: updateLoopBlockStore.update,
};
