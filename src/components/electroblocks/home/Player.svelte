<script lang="ts">
  import { onDestroy } from "svelte";

  import frameStore from "../../../stores/frame.store";
  import currentFrameStore from "../../../stores/currentFrame.store";
  import currentStepStore from "../../../stores/currentStep.store";
  import settingStore from "../../../stores/settings.store";
  import { onErrorMessage, onSuccess } from "../../../help/alerts";
  import { getAllBlocks, getBlockById } from "../../../core/blockly/helpers/block.helper";
  import is_browser from "../../../helpers/is_browser";
  import type { ArduinoFrame } from "../../../core/frames/arduino.frame";
  import { tooltip } from "@svelte-plugins/tooltips";
  import { paintUsb, updateUsb } from "../../../core/usb/player";
  import settingsStore from "../../../stores/settings.store";
  import arduinoStore, { PortState, portStateStoreSub } from "../../../stores/arduino.store";

  let frames: ArduinoFrame[] = [];
  let frameIndex = 0;
  let playing = false;
  let speedDivisor = 1;
  let maxTimePerStep = 1000;

  const unsubscribes = [];

  $: disablePlayer = frames.length === 0;

  // unsubscribes.push(
  //   currentStepStore.subscribe(async (currentIndex) => {
  //     frameNumber = currentIndex;
  //     if ($frameStore.frames.length > 0) {
  //       if (frameNumber == 0) {
  //         await paintUsb($frameStore);
  //       }
  //       if ($frameStore.frames[currentIndex]) {
  //         await updateUsb($frameStore.frames[currentIndex]);
  //       }
  //     }
  //   })
  // );

  unsubscribes.push(
    frameStore.subscribe((frameContainer) => {
      playing = false;
      const currentFrame = frames[frameIndex];
      frames = frameContainer.frames;
      
      // If we are starting out with set to first frame in the loop
      // We want to skip all the library and setup blocks
      if (frames.length === 0 || !currentFrame) {
        frameIndex = frames.findIndex(
          (f) => f.timeLine.function == "loop" && f.timeLine.iteration == 1
        );
        frameIndex = frameIndex <= 0 ? 0 : frameIndex;
        if (frames.length > 0) {
          currentFrameStore.set(frames[frameIndex]);
        }
        return;
      }

      frameIndex = navigateToClosestTimeline(currentFrame.timeLine);
      currentFrameStore.set(frames[frameIndex]);
      
    })
  );

  unsubscribes.push(
    settingStore.subscribe((newSettings) => {
      maxTimePerStep = newSettings.maxTimePerMove;
    })
  );

  function navigateToClosestTimeline(timeLine) {
    // This means we have not left the first iteration
    // If we are starting out with set to first frame in the loop
    // We want to skip all the library and setup blocks
    if (timeLine.function !== "loop" || timeLine.iteration <= 1) {
      frameIndex = frames.findIndex(
        (f) => f.timeLine.function == "loop" && f.timeLine.iteration == 1
      );
      return frameIndex <= 0 ? 0 : frameIndex;
    }

    const lastFrameTimeLine = frames[frames.length - 1].timeLine;

    // This means that there are more frames the previous version than there is now
    // So go to the last iteration in the loop
    if (timeLine.iteration > lastFrameTimeLine.iteration) {
      const loopNumber = lastFrameTimeLine.iteration;
      return frames.findIndex((f) => f.timeLine.iteration === loopNumber);
    }

    const loopNumber = timeLine.iteration;

    return frames.findIndex((f) => f.timeLine.iteration === loopNumber);
  }

   async function setCurrentFrame() {
    // reactive statement is not fast enough to do this because we are doing it immediately
    if (frameIndex == 0) {
      await paintUsb($frameStore);
    }
    currentFrameStore.set(frames[frameIndex]);
    currentStepStore.set(frameIndex);
    await updateUsb($currentFrameStore);
  }

  async function play() {
    playing = !playing;

    if (playing && isLastFrame()) {
      frameIndex = 0;
    }
    if (playing) {
      try {
        
        playing = true;
        // Because we want to make it look like the first frame has a wait time equal

        await moveWait();
        await playFrame();
      } catch (e) {
        onErrorMessage("Please refresh your browser and try again.", e);
      }
    }
  }

  async function playFrame() {
    if (!playing || isLastFrame()) {
      return;
    }

    if (frames[frameIndex].delay > 0) {
      await wait(frames[frameIndex].delay);
    }

    if (frameIndex == 0) {
      await paintUsb($frameStore);
    }
    frameIndex += 1;
    await setCurrentFrame();
    await moveWait();
    await playFrame();
    if (isLastFrame()) {
      playing = false;
    }
  }

  async function resetPlayer() {
    try {
      frameIndex = 0;
      playing = false;
      await setCurrentFrame();
      //unselect all the blocks
      getAllBlocks().forEach((b) => b.unselect());
      const selectedBlock = getBlockById($currentFrameStore.blockId);
      if (selectedBlock) {
        selectedBlock.select();
      }

    } catch (e) {
      onErrorMessage("Please refresh your browser and try again.", e);
    }
  }

  async function moveSlider() {
    await setCurrentFrame();
    playing = false;
  }

  async function prev() {
    playing = false;
    if (frameIndex <= 0) {
      return;
    }
    frameIndex -= 1;
    await setCurrentFrame();
  }

  async function next() {
    playing = false;
    if (isLastFrame()) {
      return;
    }

    frameIndex += 1;
    await setCurrentFrame();
  }

  function isLastFrame() {
    return frameIndex >= frames.length - 1;
  }

  function moveWait() {
    return new Promise((resolve) =>
      setTimeout(resolve, maxTimePerStep / speedDivisor)
    );
  }

  async function connectOrDisconnectUsb()
  {
      if (!$arduinoStore?.isOpen) {
        try {
          await arduinoStore.connectWithAndUploadFirmware($settingsStore.boardType);
          onSuccess("Firmware uploaded successfully, ready to use python!");
          await resetPlayer();
        } catch (error) {
          onErrorMessage("Failed to connect to the Arduino. Please try again.", error);
        }
      } else {
        await resetPlayer();
        await arduinoStore.disconnect();
      }
  }

  function wait(msTime) {
    return new Promise((resolve) => setTimeout(resolve, msTime));
  }

  onDestroy(async () => {
    if (is_browser()) {
      await resetPlayer();
    }
    unsubscribes.forEach((unSubFunc) => {
      unSubFunc();
    });
  });
</script>

<div id="slide-container">
  <input
    on:change={moveSlider}
    type="range"
    min="0"
    disabled={frames.length === 0}
    bind:value={frameIndex}
    max={frames.length === 0 ? 0 : frames.length - 1}
    class="slider"
    id="scrub-bar"
  />
</div>
<div
  id="video-controls-container"
  class:disable={disablePlayer}
  class="icon-bar"
>
  <span
    use:tooltip
    title="Previous Step"
    on:click={prev}
    class:disable={disablePlayer}
    id="video-debug-backward"
  >
    <i class="fa fa-backward" />
  </span>
  {#if playing}
    <span
      use:tooltip
      title="Stop"
      on:click={play}
      id="video-debug-play"
      class:disable={disablePlayer}
    >
      <i class="fa fa-stop" />
    </span>
  {:else}
    <span
      use:tooltip
      title="Play"
      on:click={play}
      id="video-debug-play"
      class:disable={disablePlayer}
    >
      <i class="fa fa-play" />
    </span>
  {/if}
  <span
    use:tooltip
    title="Next Step"
    on:click={next}
    id="video-debug-forward"
    class:disable={disablePlayer}
  >
    <i class="fa fa-forward" />
  </span>

  <span
    use:tooltip
    title="Enable USB"
    on:click={connectOrDisconnectUsb}
    class="{$portStateStoreSub}"
    id="video-debug-usb"
  >
    <i class="fa {$portStateStoreSub == PortState.CONNECTING ? "fa-cog fa-spin fa-6x fa-fw" : $portStateStoreSub == PortState.CLOSE ? "fa-usb" : "fa-eject"}"  />
  </span>
</div>

<style>
  .slider:hover {
    opacity: 1;
  }

  #video-controls-container {
    display: block;
    width: 180px;
    height: 40px;
    margin: auto;
    margin-top: 5px;
    overflow: hidden;
  }

  #video-controls-container span {
    padding: 0;
  }

  #video-controls-container span i.fa {
    color: #0c0c0c;
    opacity: 1;
    margin-top: 8px;
  }

  #video-controls-container.disable {
    cursor: not-allowed;
  }

  #video-controls-container span.disable {
    pointer-events: none;
  }

  #video-controls-container span.disable i.fa {
    color: #0c0c0c;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon-bar {
    width: 100%;
    overflow: auto;
  }

  .icon-bar .fa {
    color: #0c0c0c;
    opacity: 0.5;
    cursor: pointer;
  }

  .icon-bar span {
    float: left;
    width: 25px;
    margin: 0 10px;
    text-align: center;
    transition: all 0.3s ease;
    color: white;
    font-size: 20px;
  }

  #video-debug-play {
    font-size: 30px;
  }
  span#video-debug-play i.fa {
    margin-top: 0 !important;
    color: #b063c5 !important;
  }

  #slide-container {
    margin-top: 5px;
    margin-bottom: 4px;
    width: 100%;
    /* height: 23px; */
    z-index: 100;
  }

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 10px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
  }

  .slider:hover {
    opacity: 1;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #2c2c2c;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #0c0c0c;
    cursor: pointer;
  }

  input:invalid {
    box-shadow: none;
  }
  #video-controls-container span.connected i.fa  {
    color: #eb423c;
  }

  #video-controls-container span.disconnected i.fa  {
    color: #b063c5;
  }
</style>
