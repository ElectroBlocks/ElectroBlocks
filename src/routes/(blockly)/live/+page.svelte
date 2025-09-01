<script>
  import { onMount } from "svelte";
  import Simulator from "../../../components/electroblocks/home/Simulator.svelte";
  import arduinoStore, {
  PortState,
  portStateStoreSub,
    restartArduino,
    setupComponents,
    updateComponents,
  } from "../../../stores/arduino.store";
  import settingsStore from "../../../stores/settings.store";
  import {
    getAllBlocks,
    getBlockByType,
  } from "../../../core/blockly/helpers/block.helper";
  import { getAllVariables } from "../../../core/blockly/helpers/variable.helper";
  import { transformBlock } from "../../../core/blockly/transformers/block.transformer";
  import { MicroControllerType } from "../../../core/microcontroller/microcontroller";
  import { transformVariable } from "../../../core/blockly/transformers/variables.transformer";
  import { generateNextFrame } from "../../../core/frames/event-to-frame.factory";
  import currentFrameStore from "../../../stores/currentFrame.store";
  import { wait } from "../../../helpers/wait";
  import frameStore from "../../../stores/frame.store";
  let generator;
  let isPlaying = false;
  let frameCount = 0;
  const createTestEvent = (blockId) => {
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
    } else {
      // TODO see if the firmware is loaded before flashing it
      await arduinoStore.connectWithAndUploadFirmware($settingsStore.boardType);
    }
  }

  frameStore.subscribe(container => {
    console.log('frame change');
    frameCount = 0;
  });

  async function onPlayButton()
  {
    if (!arduinoStore.isConnected() || isPlaying) return;
    isPlaying = true;
    await play();
  }

  function onStopButton()
  {
    isPlaying = false;
    frameCount = 0;
  }

  async function play() {
    if (!isPlaying || $portStateStoreSub != PortState.OPEN) {
      return;
    }
    if (frameCount == 0) {
      var event = createTestEvent(getBlockByType("arduino_loop").id);
      generator = generateNextFrame(event);
      await restartArduino();
      let setupFrameCommands =  $frameStore.frames[$frameStore.frames.length - 1];
      console.log(setupFrameCommands);
      // We need to register all the sensors before we start generating new frames
      await setupComponents(setupFrameCommands);
      let frame = (await generator.next()).value;
      console.log(frame, 'frame-test-most');
      await updateComponents(frame);
      currentFrameStore.set(frame);
      frameCount += 1;
      await wait(frame.delay);
      await play();
      return;
    }
    let frame = (await generator.next()).value;
    frameCount += 1;
    currentFrameStore.set(frame);
    await updateComponents(frame);
    await wait(frame.delay);
    await wait(100); 
    await play();
  }
  
</script>

<main style="height: 100px;">
  <div class="row">
    <div class="col-auto">
      <button on:click={connectOrEjectArduino}>
        <i class="ph ph-fill ph-plug"></i>
      </button>
    </div>
    <div class="col text-center">
      <h6>Arduino Status: {$portStateStoreSub.toString()}</h6>
    </div>
    <div class="col-auto">
      <button on:click={onPlayButton}  disabled={$portStateStoreSub !== PortState.OPEN}>
        <i class="ph ph-play"></i>
      </button>
      <button on:click={onStopButton} disabled={$portStateStoreSub !== PortState.OPEN}>
        <i class="ph ph-stop"></i>
      </button>
    </div>
    <div class="row">
      <h3 class="text-center">{$currentFrameStore?.explanation ?? '' }</h3>
    </div>
  </div>
</main>

<Simulator  />

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
