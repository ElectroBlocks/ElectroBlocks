import { writable } from 'svelte/store';


const codeStore = writable('');

codeStore.subscribe(code => console.log(code, 'arduino code'))

export default {
  set: codeStore.set,
  subscribe: codeStore.subscribe
}