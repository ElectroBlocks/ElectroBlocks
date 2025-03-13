import { writable } from "svelte/store";
import { MicroControllerType } from "../core/microcontroller/microcontroller";

const cCode = `int simple_loop_variable = 0;
struct RGB {
	int red;
	int green;
	int blue;
};

void setup() {}

void loop() {}
`;
const codeStore = writable({
  cLang: cCode,
  pythonLang: pythonCode,
  boardType: MicroControllerType.ARDUINO_UNO,
  hiddenCategories: [] 
});

function updateBoardType(boardType: MicroControllerType) {
  let hiddenCategories: string[] = [];

  if (boardType === MicroControllerType.ARDUINO_MEGA) {
    hiddenCategories = ["Bluetooth"]; // Disable Bluetooth for Mega
  } else {
    hiddenCategories = []; // Enable Bluetooth for Uno (or other boards)
  }
  
  console.log("Updated Board Type:", boardType);
  console.log("Updated Hidden Categories:", hiddenCategories);

  codeStore.set({ code: resetCode, boardType, hiddenCategories });
}

export default {
  set: codeStore.set,
  subscribe: codeStore.subscribe,
  resetCode: (boardType: MicroControllerType) =>
    codeStore.set({ code: resetCode, boardType }),
};
