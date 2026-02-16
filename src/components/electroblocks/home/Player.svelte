<script lang="ts">
  import { onDestroy } from "svelte";
  import Blockly from "blockly";

  import frameStore from "../../../stores/frame.store";
  import currentFrameStore from "../../../stores/currentFrame.store";
  import currentStepStore from "../../../stores/currentStep.store";
  import settingStore from "../../../stores/settings.store";
  import { onConfirm, onErrorMessage, onSuccess } from "../../../help/alerts";
  import {
    getAllBlocks,
    getBlockByType,
  } from "../../../core/blockly/helpers/block.helper";
  import is_browser from "../../../helpers/is_browser";
  import type { ArduinoFrame } from "../../../core/frames/arduino.frame";
  import { tooltip } from "@svelte-plugins/tooltips";
  import arduinoStore, {
    getFeatures,
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
    mdiFastForward,
    mdiFastForward10,
    mdiFastForwardOutline,
    mdiFlash,
    mdiPlayCircle,
    mdiStopCircle,
    mdiUploadCircleOutline,
  } from "@mdi/js";
  import { generateNewFramesWithLoop, generateNextFrame } from "../../../core/frames/event-to-frame.factory";
  import { getAllVariables } from "../../../core/blockly/helpers/variable.helper";
  import { transformBlock } from "../../../core/blockly/transformers/block.transformer";
  import { transformVariable } from "../../../core/blockly/transformers/variables.transformer";
  import { MicroControllerType } from "../../../core/microcontroller/microcontroller";
  import codeStore from "../../../stores/code.store";
  import { createFrames } from "../../../core/blockly/registerEvents";

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
  let isContinuous = false;

  // Live Player
  let generator;
  let isPlayingLive = false;
  let frameCount = 0;
  let successfullyCompiledInLiveMode = false;
  let hasUploadedFirmware = false;

  const unsubscribes = [];

  $: setCurrentFrame(frameNumber);
  $: disablePlayer = frames.length === 0;
  $: frameIndex = frameNumber - 1;
  $: canUploadFirmware =
    $simulatorStore == SimulatorMode.LIVE && successfullyCompiledInLiveMode;

  unsubscribes.push(
    currentStepStore.subscribe((currentIndex) => {
      frameNumber = currentIndex;
    }),
  );

  function getFirstLoopFrameIndex() {
    const idx = frames.findIndex(
      (f) => f.timeLine.function === "loop" && f.timeLine.iteration === 1,
    );
    return idx < 0 ? 0 : idx;
  }

  async function exitLiveMode() {
    simulatorStore.set(SimulatorMode.VIRTUAL);
    onStopButton();
    await resetPlayer();
  }

  async function uploadCode() {
    try {
      await arduinoStore.uploadCode(
        $settingStore.boardType,
        $codeStore.cLang,
        $codeStore.imports,
      );
      onSuccess("Coding Uploaded!!");
      // We want to enable usb messages
      simulatorStore.set(SimulatorMode.VIRTUAL);
    } catch (error) {
      if (error.message.includes("No port selected by the user.")) {
        onErrorMessage(
          "Please try again and select a usb port if you wish to go live.",
          error,
        );
        return;
      }
      onErrorMessage("Error uploading code", error);
    }
  }

  function goToLiveMode() {
    simulatorStore.set(SimulatorMode.LIVE);
  }

  async function uploadFirmwareForLiveMode() {
    try {
      var result = await onConfirm(`🚀 Start Live Mode?
Your program will run and can talk to your Arduino.
You'll see messages and results on this page.`);
      if (!result) {
        simulatorStore.set(SimulatorMode.VIRTUAL);
        return;
      }
      const whatHappenned = await arduinoStore.connectWithAndUploadFirmware(
        $settingStore.boardType,
        $codeStore.enableFlags,
      );
      if (whatHappenned == "full upload") {
        onSuccess("Firmware was successfully loaded!");
      }

      hasUploadedFirmware = true;
    } catch (error) {
      if (error.message.includes("No port selected by the user.")) {
        onErrorMessage(
          "Please try again and select a usb port if you wish to go live.",
          error,
          "",
        );
        return;
      }
      onErrorMessage("Error flashing firmware please try again.", error, "");
    }
  }

  unsubscribes.push(
    frameStore.subscribe(async (frameContainer) => {
      if ($simulatorStore != SimulatorMode.LIVE) {
        return;
      }
      isPlayingLive = false;
      // Reseting the frames back to zero.
      frames = frameContainer.frames;
      currentFrameStore.set(frames[0]);
      // Needs to be reset so it triggers a new generator
      frameCount = 0;
      if (!hasUploadedFirmware) return;
      const commandString = await getFeatures();
      const isReadyWithoutCompiling =
        $codeStore.enableFlags.filter((flag) => !commandString.includes(flag))
          .length == 0;
      if (isReadyWithoutCompiling) {
        return;
      }
      await onConfirm(
        "Please click on 'Start Live Mode' to recompile the firmware for your new code.",
      );
      hasUploadedFirmware = false; // this means it's not ready to run on the live mode.
    }),
    frameStore.subscribe(async (frameContainer) => {
      if ($simulatorStore == SimulatorMode.LIVE) {
        return;
      }
      await resetPlayer();
    }),
    simulatorStore.subscribe(async (mode) => {
      const loopBlock = getBlockByType("arduino_loop");
      if (!loopBlock) return false;
      if (mode == SimulatorMode.VIRTUAL) {
        hasUploadedFirmware = false;
        // should regenerate if it's only a live coding issue.
        await createFrames({
          type: Blockly.Events.MOVE,
          blockId: loopBlock.id,
        });
        return;
      }
      successfullyCompiledInLiveMode = await createFrames({
        type: Blockly.Events.MOVE,
        blockId: loopBlock.id,
      });
      if (!successfullyCompiledInLiveMode && mode == SimulatorMode.LIVE) {
        onErrorMessage(
          "Your program isn’t ready to run yet.\nLook for blocks with a ⚠️ symbol.",
          {},
          "Can’t start Live mode",
        );
      }
    }),
  );

  unsubscribes.push(
    settingStore.subscribe((newSettings) => {
      maxTimePerStep = newSettings.maxTimePerMove;
    }),
  );

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

  async function playLive(justNext = false) {
    try {
      if (
        (!isPlayingLive && !justNext) ||
        $portStateStoreSub != PortState.OPEN
      ) {
        return;
      }
      if ($frameStore.frames.length == 0) {
        onConfirm("Put blocks into the setup block to get started");
        onStopButton();
        return;
      }
      if (frameCount == 0) {
        var event = createBlocklyEvent(getBlockByType("arduino_loop").id);
        generator = generateNextFrame(event);
        await restartArduino();
        let setupFrameCommands =
          $frameStore.frames[$frameStore.frames.length - 1];
        // We need to register all the sensors before we start generating new frames
        await setupComponents(setupFrameCommands);
        let frame = (await generator.next()).value;
        await updateComponents(frame);
        currentFrameStore.set(frame);
        frameCount += 1;
        await wait(frame.delay);
        await wait(100); // We don't want to blast the usb it will error out.
        if (!justNext) {
          await playLive();
        }
        return;
      }
      let frame = (await generator.next()).value;
      frameCount += 1;
      currentFrameStore.set(frame);
      await updateComponents(frame);
      await wait(frame.delay);
      await wait(100);
      if (!justNext) {
        await playLive();
      }
    } catch (error) {
      onStopButton();
      onErrorMessage(
        "There was an error running the code, please download, refresh and try again.",
        error,
      );
    }
  }
  async function nextFrame() {
    isPlayingLive = false;
    await playLive(true);
  }
  async function onPlayButton() {
    try {
      if (!arduinoStore.isConnected() || isPlayingLive) return;
      isPlayingLive = true;
      await playLive();
    } catch (error) {
      onErrorMessage(
        "There was an error running the code, please download, refresh and try again.",
        error,
      );
    }
  }

  function onStopButton() {
    isPlayingLive = false;
    frameCount = 0;
    currentFrameStore.set($frameStore.frames[$frameStore.frames.length - 1]);
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
    if (!playing) {
      return;
    }

    currentFrameStore.set(frames[frameNumber]);
    frameNumber += 1;

    if (frames[frameNumber].delay > 0) {
      await wait(frames[frameNumber].delay);
    }

    await moveWait();


    if (!isLastFrame()) {
      await playFrame();
      return;
    }

    if (!isContinuous) {
      await wait(1000);
      await resetPlayer();
      return;
    }
    const newFrames = generateNewFramesWithLoop($currentFrameStore);
    frames = newFrames;
    frameIndex = 0;
    frameNumber = 0;
    
    await moveWait();
    await playFrame();
  }

  async function resetPlayer() {
    try {
      frames = $frameStore.frames;
      frameNumber = 0;
      frameIndex = 0;
      playing = false;
      isContinuous = false;
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
      setTimeout(resolve, maxTimePerStep / speedDivisor),
    );
  }

  function wait(msTime) {
    return new Promise((resolve) => setTimeout(resolve, msTime));
  }

  onDestroy(async () => {
    if (is_browser()) {
      await resetPlayer();
      onStopButton();
    }
    unsubscribes.forEach((unSubFunc) => {
      unSubFunc();
    });
  });
</script>

{#if $portStateStoreSub != PortState.CONNECTING && $simulatorStore == SimulatorMode.VIRTUAL}
  {#if !isContinuous}
  <div id="slide-container">
    <input
      on:change={moveSlider}
      type="range"
      min="0"
      disabled={frames.length === 0 || playing || isContinuous}
      bind:value={frameNumber}
      max={frames.length === 0 ? 0 : frames.length - 1}
      class="slider"
      id="scrub-bar"
    />
  </div>
  {/if}
  <div
    id="video-controls-container"
    class:disable={disablePlayer}
    class="icon-bar"
    class:continous-on={isContinuous}
  >
    <div id="side-options">
      {#if !$frameStore.error}
        <span
          class="live-mode"
          use:tooltip={playerTooltips}
          title="Live Mode"
          on:click={goToLiveMode}
        >
          <Icon path={mdiFlash} size={40} />
        </span>
        <span
          class="upload"
          use:tooltip={playerTooltips}
          on:click={uploadCode}
          title="Upload Code"
        >
          <Icon path={mdiUploadCircleOutline} size={40} />
        </span>
      {/if}
    </div>
    <div id="main-player">
      <span
        use:tooltip
        title="Previous Step"
        on:click={prev}
        class:disable={disablePlayer || playing || isContinuous}
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
        class:disable={disablePlayer || playing || isContinuous}
      >
        <i class="fa fa-forward" />
      </span>
      {#if isContinuous}
        <span
        use:tooltip
        title = "Continuous On"
        on:click={async () => {
          if (playing) return;
          isContinuous = false;
          frames = $frameStore.frames;
          await resetPlayer();
        }}
        class:disable={disablePlayer || playing}
      >
        <i
          class="fa fa-repeat repeat-on"
        />
      </span>
      {:else}
      <span
        use:tooltip
        title = "Continuous Off"
        on:click={async () => {
          if (playing) return;
          isContinuous = true;
        }}
        class:disable={disablePlayer || playing}
      >
        <i
          class="fa fa-repeat repeat-off"
        />
      </span>
      {/if}
      
    </div>
  </div>
{:else if $portStateStoreSub == PortState.CONNECTING}
  <h2 class="text-center mt-4">
    Loading <Icon spinning={true} size={30} path={mdiCogClockwise} />
  </h2>
{:else if $simulatorStore == SimulatorMode.LIVE}
  <div style="height: 50px;" class:disable={disablePlayer}>
    <span on:click={exitLiveMode}>
      <span class="pull-right me-3" use:tooltip title="Exit">
        <Icon color="#aa0000" path={mdiEjectOutline} size={40} />
      </span>
    </span>
    {#if hasUploadedFirmware && !$frameStore.error}
      {#if isPlayingLive}
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
      <span
        use:tooltip
        title="Next Frame"
        on:click={nextFrame}
        id="video-debug-play"
      >
        <Icon color="green" path={mdiFastForwardOutline} size={40} />
      </span>
    {:else if $frameStore.error}
      <h4 class="mt-4 p-1">Fix blocks with the ⚠️ symbol.</h4>
    {:else}
      <button
        on:click={uploadFirmwareForLiveMode}
        class="btn btn-primary mt-1 pull-left">Start Live Mode</button
      >
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
    width: 180px;
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
  #video-controls-container.continous-on {
    margin-top: 25px;
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

  .repeat-on {
    opacity: 1;
    color: #b063c5 !important
  }
  .repeat-off {
    opacity: 0.5;
  }
</style>
