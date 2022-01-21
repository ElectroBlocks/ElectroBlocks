import { writable } from 'svelte/store';

const lessonOpenStore = writable(false);

export default {
  subscribe: lessonOpenStore.subscribe,
  set: lessonOpenStore.set,
  update: lessonOpenStore.update,
};
