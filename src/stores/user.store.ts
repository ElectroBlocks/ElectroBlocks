import { readable } from "svelte/store";
const userStore = readable(undefined, () => {});

export default userStore;
