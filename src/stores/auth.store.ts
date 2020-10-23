import { writable } from "svelte/store";

const authStore = writable<{ isLoggedIn: boolean, uid: string }>({ isLoggedIn: false, uid: null });

export default {
  subscribe: authStore.subscribe,
  set: authStore.set
};
