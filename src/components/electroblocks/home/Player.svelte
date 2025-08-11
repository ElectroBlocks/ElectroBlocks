<script lang="ts">
  import { onDestroy } from "svelte";

  import frameStore from "../../../stores/frame.store";
  import currentFrameStore from "../../../stores/currentFrame.store";
  import currentStepStore from "../../../stores/currentStep.store";
  import settingStore from "../../../stores/settings.store";
  import { onConfirm, onErrorMessage, onSuccess } from "../../../help/alerts";
  import { getAllBlocks, getBlockByType } from "../../../core/blockly/helpers/block.helper";
  import is_browser from "../../../helpers/is_browser";
  import type { ArduinoFrame } from "../../../core/frames/arduino.frame";
  import { tooltip } from "@svelte-plugins/tooltips";
  import arduinoStore, {
    PortState,
    portStateStoreSub,
    restartArduino,
    setupComponents,
    SimulatorMode,
    simulatorStore,
    updateComponents,
  } from "../../../stores/arduino.store";
  import Icon from "../../Icon.svelte";
  import {
    mdiCogClockwise,
    mdiEjectOutline,
    mdiFlash,
    mdiPlayCircle,
    mdiStopCircle,
    mdiUploadCircleOutline,
  } from "@mdi/js";
  import { generateNextFrame } from "../../../core/frames/event-to-frame.factory";
  import { getAllVariables } from "../../../core/blockly/helpers/variable.helper";
  import { transformBlock } from "../../../core/blockly/transformers/block.transformer";
  import { transformVariable } from "../../../core/blockly/transformers/variables.transformer";
  import { MicroControllerType } from "../../../core/microcontroller/microcontroller";

  const playerTooltips = {
    position: "top",
    align: "center",
    animation: "slide",
    theme: "player-tooltips",
  };

  let frames: ArduinoFrame[] = [];
  let frameNumber = 1;
  let playing = false;
  let speedDivisor = 1;
  let maxTimePerStep = 1000;

  // Live Player
  let generator;
  let isPlaying = false;
  let frameCount = 0;


  const unsubscribes = [];

  $: setCurrentFrame(frameNumber);
  $: disablePlayer = frames.length === 0;
  $: frameIndex = frameNumber - 1;

  unsubscribes.push(
    currentStepStore.subscribe((currentIndex) => {
      frameNumber = currentIndex;
    })
  );

  function exitLiveMode() {
    simulatorStore.set(SimulatorMode.VIRTUAL);
    onStopButton();
  }

  async function goToLiveMode() {
    try {
      var result = await onConfirm(`🚀 We're about to go live!
We'll set things up so your Arduino can receive commands over USB.
Click Ok to confirm and get started!`);
      if (!result) {
        return;
      }
      await arduinoStore.connectWithAndUploadFirmware($settingStore.boardType);
      onSuccess("Firmware was successfully loaded!");

      simulatorStore.set(SimulatorMode.LIVE);
    } catch (error) {
      if (error.message.includes("No port selected by the user.")) {
        onErrorMessage(
          "Please try again and select a usb port if you wish to go live.",
          error
        );
        return;
      }
      onErrorMessage("Error flashing firmware please try again.", error);
    }
  }

  unsubscribes.push(
    frameStore.subscribe((frameContainer) => {
      playing = false;
      const currentFrame = frames[frameNumber];
      frames = frameContainer.frames;

      // If we are starting out with set to first frame in the loop
      // We want to skip all the library and setup blocks
      if (frames.length === 0 || !currentFrame) {
        frameNumber = frames.findIndex(
          (f) => f.timeLine.function == "loop" && f.timeLine.iteration == 1
        );
        frameNumber = frameNumber < 0 ? 0 : frameNumber;
        if (frames.length > 0) {
          currentFrameStore.set(frames[frameNumber]);
        }
        return;
      }

      frameNumber = navigateToClosestTimeline(currentFrame.timeLine);
      currentFrameStore.set(frames[frameNumber]);
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
      frameNumber = frames.findIndex(
        (f) => f.timeLine.function == "loop" && f.timeLine.iteration == 1
      );
      return frameNumber < 0 ? 0 : frameNumber;
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

  function setCurrentFrame(frameNumber) {
    currentFrameStore.set(frames[frameNumber]);
    currentStepStore.set(frameNumber);
  }

  const createBlocklyEvent = (blockId) => {
    return {
      blockId: blockId,
      blocks: getAllBlocks().map(transformBlock),
      variables: getAllVariables().map(transformVariable),
      type: "move",
      microController: MicroControllerType.ARDUINO_UNO,
    };
  };

  async function playLive() {
    if (!isPlaying || $portStateStoreSub != PortState.OPEN) {
      return;
    }
    if (frameCount == 0) {
      var event = createBlocklyEvent(getBlockByType("arduino_loop").id);
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
      await playLive();
      return;
    }
    let frame = (await generator.next()).value;
    frameCount += 1;
    currentFrameStore.set(frame);
    await updateComponents(frame);
    await wait(frame.delay);
    await wait(100); 
    await playLive();
  }

  async function onPlayButton()
  {
    if (!arduinoStore.isConnected() || isPlaying) return;
    isPlaying = true;
    await playLive();
  }

  function onStopButton()
  {
    isPlaying = false;
    frameCount = 0;
  }

  async function play() {
    playing = !playing;

    if (playing && isLastFrame()) {
      frameNumber = 0;
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

    if (frames[frameNumber].delay > 0) {
      await wait(frames[frameNumber].delay);
    }

    currentFrameStore.set(frames[frameNumber]);
    frameNumber += 1;
    await moveWait();
    await playFrame();
    if (isLastFrame()) {
      playing = false;
    }
  }

  async function resetPlayer() {
    try {
      frameNumber = 0;
      playing = false;
      currentFrameStore.set(frames[frameIndex]);
      //unselect all the blocks
      getAllBlocks().forEach((b) => b.unselect());
    } catch (e) {
      onErrorMessage("Please refresh your browser and try again.", e);
    }
  }

  function moveSlider() {
    currentFrameStore.set(frames[frameIndex]);
    playing = false;
  }

  function prev() {
    playing = false;
    if (frameNumber <= 0) {
      return;
    }
    frameNumber -= 1;
    currentFrameStore.set(frames[frameIndex]);
  }

  function next() {
    playing = false;
    if (isLastFrame()) {
      return;
    }

    frameNumber += 1;
    currentFrameStore.set(frames[frameIndex]);
  }

  function isLastFrame() {
    return frameNumber >= frames.length - 1;
  }

  function moveWait() {
    return new Promise((resolve) =>
      setTimeout(resolve, maxTimePerStep / speedDivisor)
    );
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

{#if $portStateStoreSub != PortState.CONNECTING && $simulatorStore == SimulatorMode.VIRTUAL}
  <div id="slide-container">
    <input
      on:change={moveSlider}
      type="range"
      min="0"
      disabled={frames.length === 0}
      bind:value={frameNumber}
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
  <div id="side-options">
<span class="live-mode" use:tooltip={playerTooltips} title="Live Mode" on:click={goToLiveMode}>
    <Icon path={mdiFlash} size={40}  />
  </span>
  <span class="upload" use:tooltip={playerTooltips} title="Upload Code" >
    <Icon path={mdiUploadCircleOutline}  size={40} />
  </span>
  </div>
    <div id="main-player">
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
    </div>
  </div>
  
  
{:else if $portStateStoreSub == PortState.CONNECTING}
  <h2 class="text-center mt-4">
    Loading Firmware <Icon spinning={true} size={30} path={mdiCogClockwise} />
  </h2>
{:else}
  <div class:disable={disablePlayer}>
    <span on:click={exitLiveMode}>
      <span class="pull-right me-3" use:tooltip title="Exit">
        <Icon color="#aa0000" path={mdiEjectOutline} size={40} />
      </span>
    </span>
    {#if isPlaying}
      <span
        use:tooltip
        title="Stop"
        on:click={onStopButton}
        id="video-debug-play"
        class:disable={disablePlayer}
      >
        <Icon color="red" path={mdiStopCircle} size={40} />
      </span>
    {:else}
      <span
        use:tooltip
        title="Play"
        on:click={onPlayButton}
        id="video-debug-play"
        class:disable={disablePlayer}
      >
        <Icon color="green" path={mdiPlayCircle} size={40} />
      </span>
    {/if}
  </div>
{/if}

<style>
  .slider:hover {
    opacity: 1;
  }

  #video-controls-container {
    position: relative;
    width: 100%;
    height: 40px;
    overflow: visible;
  }

  #main-player {
    display: block;
    text-align: center;
    width: 135px;
    position: absolute;
    left: 50%;
    bottom: 4px;
    transform: translate(-50%, 0%);
    height: 40px;
    margin: auto;
    margin-top: 5px;
    overflow: visible;
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
    font-size: 20px;
  }
  .fa-play,
  .fa-stop {
    margin-left: 2px;
  }

  i.fa-stop {
    color: rgb(240, 66, 66) !important;
  }

  #side-options {
    position: absolute;
    right: 10px;
    top: 0px;
    height: 45px;
    width: 100px;
    overflow: visible;
  }
  #side-options .live-mode {
    color: #b063c5;
  }

  #side-options .upload {
    color: #512c62;
  }

  #video-debug-play {
    font-size: 30px;
  }
  span#video-debug-play i.fa.fa-play {
    color: #b063c5 !important;
  }

  span#video-debug-play i.fa {
    margin-top: -10px;
  }

  #slide-container {
    margin-top: 5px;
    margin-bottom: 4px;
    width: 100%;
    /* height: 23px; */
    z-index: 100;
    overflow: visible;
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
  :global(div.tooltip.player-tooltips) {
    z-index: 1000;
  }
</style>
