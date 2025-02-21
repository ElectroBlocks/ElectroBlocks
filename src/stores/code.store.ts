import { writable } from "svelte/store";
import { MicroControllerType } from "../core/microcontroller/microcontroller";

const resetCode = `int simple_loop_variable = 0;
struct RGB {
	int red;
	int green;
	int blue;
};

void setup() {}

void loop() {}
`;

const codeStore = writable({
  code: resetCode,
  boardType: MicroControllerType.ARDUINO_UNO,
  hiddenCategories: [] 
});

function updateBoardType(boardType: MicroControllerType) {
  let hiddenCategories: string[] = [];

  if (boardType === MicroControllerType.ARDUINO_MEGA) {
    hiddenCategories = ["Bluetooth"]; 
  }

  codeStore.set({ code: resetCode, boardType, hiddenCategories }); 
}

export default {
  set: codeStore.set,
  subscribe: codeStore.subscribe,
  resetCode: updateBoardType,
};
