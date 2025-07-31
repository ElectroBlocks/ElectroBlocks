<script>
  import { onMount } from "svelte";
  import Simulator from "../../../components/electroblocks/home/Simulator.svelte";
  import arduinoStore from "../../../stores/arduino.store";
  import settingsStore from "../../../stores/settings.store";
  import { getAllBlocks, getBlockByType } from "../../../core/blockly/helpers/block.helper";
  import { getAllVariables } from "../../../core/blockly/helpers/variable.helper";
  import { transformBlock } from "../../../core/blockly/transformers/block.transformer";
  import { MicroControllerType } from "../../../core/microcontroller/microcontroller";
  import { transformVariable } from "../../../core/blockly/transformers/variables.transformer";
  import { generateNextFrame } from "../../../core/frames/event-to-frame.factory";
  import currentFrameStore from "../../../stores/currentFrame.store";
  import { paintUsb } from "../../../core/usb/player";
  let isConnected = false;
  let generator;
  let isPlaying = false;
  const createTestEvent = (
  blockId,
) => {
  return {
    blockId: blockId,
    blocks: getAllBlocks().map(transformBlock),
    variables: getAllVariables().map(transformVariable),
    type: "move",
    microController: MicroControllerType.ARDUINO_UNO,
  };
};
  async function connectOrEjectArduino() {
    if (arduinoStore.isConnected()) {
      await arduinoStore.disconnect();
      isConnected = false;
    } else {
      // TODO see if the firmware is loaded before flashing it
      await arduinoStore.connectWithAndUploadFirmware($settingsStore.boardType);
      var event = createTestEvent(getBlockByType('arduino_loop').id);
      generator = generateNextFrame(event);
      // Steps 
      // 1. Restart the arduino command
      // 2. If the frame is in a preset call right command have one command for everything
      isConnected = true;
    }
  }
  async function play()
  {
    if (isPlaying) {
      return;
    }
    isPlaying = true;
    const nextFrame = generator.next();
    currentFrameStore.set(nextFrame.value);

    await new Promise(resolve => setTimeout(resolve, 20)); // Simulate delay
  }
  onMount(() => {
    isConnected = arduinoStore.isConnected();
  });
</script>

<main style="height: 100px;">
  <div class="row">
    <div class="col-auto">
      <button on:click={connectOrEjectArduino}>
        <i class="ph ph-fill ph-plug"></i>
      </button>
    </div>
    <div class="col text-center">
      <h6>Status: Connected</h6>
    </div>
    <div class="col-auto">
      <button disabled={!isConnected}>
        <i class="ph ph-play"></i>
      </button>
      <button disabled={!isConnected}>
        <i class="ph ph-stop"></i>
      </button>
    </div>
    <div class="row">
      <h3>Arduino is turning LED on.</h3>
    </div>
  </div>
</main>

<Simulator mode="live" />

<style>
  button {
    margin: 5px;
    border-radius: 2px;
    font-size: 20px;
    padding: 5px 10px;
    width: 50px;
    height: 36px;
    margin-top: 10px;
    cursor: pointer;
    color: black;
    background-color: rgb(254 244 255);
    border: none;
  }
  button i {
    transition: ease-in-out 0.4s font-size;
  }
  button:focus,
  button:active {
    outline: none;
  }
  button:active i {
    font-size: 18px;
  }
  button:disabled {
    cursor: not-allowed;
    background-color: rgb(255, 255, 255);
    color: #dce6de;
  }
  button:disabled i {
    font-size: 20px;
  }
</style>
