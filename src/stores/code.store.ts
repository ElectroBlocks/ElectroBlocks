import { writable } from "svelte/store";

const resetCode = `int simple_loop_variable = 0;
struct RGB {
	int red;
	int green;
	int blue;
};




void setup() {

}


void loop() {

}
`;
const codeStore = writable(resetCode);

codeStore.subscribe((code) => console.log(code, "arduino code"));

export default {
  set: codeStore.set,
  subscribe: codeStore.subscribe,
  resetCode: () => codeStore.set(resetCode),
};
