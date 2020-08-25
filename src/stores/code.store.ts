import { writable } from "svelte/store";

const codeStore = writable(`int simple_loop_variable = 0;
struct RGB {
	int red;
	int green;
	int blue;
};




void setup() {

}


void loop() {

}
`);

codeStore.subscribe((code) => console.log(code, "arduino code"));

export default {
  set: codeStore.set,
  subscribe: codeStore.subscribe,
};
