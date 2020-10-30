import { writable } from "svelte/store";

const authStore = writable<{
  isLoggedIn: boolean;
  uid: string;
  firebaseControlled: boolean;
}>({ isLoggedIn: false, uid: null, firebaseControlled: false });

export default {
  subscribe: authStore.subscribe,
  set: authStore.set
};
