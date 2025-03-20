import { writable } from "svelte/store";
import { MicrocontrollerType } from "../core/microcontroller/microcontroller";

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
const codeStore = writable({
  code: resetCode,
  boardType: MicrocontrollerType.ARDUINO_UNO,
});

export default {
  set: codeStore.set,
  subscribe: codeStore.subscribe,
  resetCode: (boardType: MicrocontrollerType) =>
    codeStore.set({ code: resetCode, boardType }),
};