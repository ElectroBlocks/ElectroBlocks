<script>
  import frameStore from "../../../stores/frame.store";
  import currentFrameStore from "../../../stores/currentFrame.store";
  import currentStepStore from "../../../stores/currentStep.store";
  let frames = [];
  let frameNumber = 1;
  let playing = false;
  let speedDivisor = 1;
  $: setCurrentFrame(frameNumber);
  $: disablePlayer = frames.length === 0;
  $: frameIndex = frameNumber - 1;

  frameStore.subscribe(newFrames => {
    playing = false;
    const currentFrame = frames[frameNumber];
    frames = newFrames;

    // If we are starting out with set to first frame.
    if (frames.length === 0 || !currentFrame) {
      frameNumber = 0;
      if (frames.length > 0) {
        currentFrameStore.set(frames[frameNumber]);
      }
      return;
    }

    frameNumber = navigateToClosestTimeline(currentFrame.timeLine);
    currentFrameStore.set(frames[frameNumber]);
  });

  function navigateToClosestTimeline(timeLine) {
    if (timeLine.function !== "loop") {
      return 0;
    }

    const lastFrameTimeLine = frames[frames.length - 1].timeLine;

    if (timeLine.iteration > lastFrameTimeLine.iteration) {
      const loopNumber = lastFrameTimeLine.iteration;
      return frames.findIndex(f => f.timeLine.iteration === loopNumber);
    }

    const loopNumber = timeLine.iteration;

    return frames.findIndex(f => f.timeLine.iteration === loopNumber);
  }

  function setCurrentFrame(frameNumber) {
    currentFrameStore.set(frames[frameNumber]);
    currentStepStore.set(frameNumber);
  }

  async function play() {
    playing = !playing;

    if (playing && isLastFrame()) {
      frameNumber = 0;
    }

    if (playing) {
      playing = true;
      await playFrame();
    }
  }

  async function playFrame() {
    if (!playing || isLastFrame()) {
      return;
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
    frameNumber = 0;
    playing = false;
    await moveWait();
    currentFrameStore.set(frames[frameIndex]);
    await play();
  }

  function stop() {
    playing = false;
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
    return new Promise(resolve => setTimeout(resolve, 800 / speedDivisor));
  }
</script>

<style>
  #slide-container {
    width: 100%;
    height: 35px;
    z-index: 100;
  }

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 25px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: 0.2s;
    transition: opacity 0.2s;
  }

  .slider[disabled] {
    cursor: not-allowed;
  }

  .slider:hover {
    opacity: 1;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    background: #505bda;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    background: #505bda;
    cursor: pointer;
  }

  #video-controls-container span {
    padding: 0;
  }
  #video-controls-container label {
    font-size: 30px;
    font-family: "Biryani", Arial, Helvetica, sans-serif;
    color: #505bda;
    font-weight: 600;
  }
  #video-controls-container input {
    margin-top: 10px;
    padding: 1px;
    margin-left: 10px;
    height: 20px;
    font-size: 16px;
    vertical-align: top;
  }

  #video-controls-container span i.fa {
    color: #505bda;
    opacity: 1;
  }

  #video-controls-container.disable {
    cursor: not-allowed;
  }

  #video-controls-container span.disable {
    pointer-events: none;
  }

  #video-controls-container span.disable i.fa {
    color: #505bda;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon-bar {
    width: 100%;
    overflow: auto;
  }

  .icon-bar .fa {
    color: #505bda;
    opacity: 0.5;
    cursor: pointer;
  }

  .icon-bar span:first-of-type {
    margin-left: 15%;
  }

  .icon-bar span {
    float: left;
    width: 10%;
    text-align: center;
    padding: 12px 0;
    transition: all 0.3s ease;
    color: white;
    font-size: 36px;
  }

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 25px;
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
    width: 25px;
    height: 25px;
    background: #505bda;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    background: #505bda;
    cursor: pointer;
  }

  .menu-section {
    display: inline-block;
    margin-right: 25px;
  }

  #speed-control {
    vertical-align: top;
    text-align: left;
    width: 30%;
  }

  input:invalid {
    box-shadow: none;
  }
</style>

<div id="slide-container">
  <input
    on:change={moveSlider}
    type="range"
    min="0"
    disabled={frames.length === 0}
    bind:value={frameNumber}
    max={frames.length === 0 ? 0 : frames.length - 1}
    class="slider"
    id="scrub-bar" />
</div>
<div
  id="video-controls-container"
  class:disable={disablePlayer}
  class="icon-bar">
  <span on:click={prev} class:disable={disablePlayer} id="video-debug-backward">
    <i class="fa fa-backward" />
  </span>
  <span on:click={play} id="video-debug-play" class:disable={disablePlayer}>
    <i class="fa" class:fa-play={!playing} class:fa-stop={playing} />
  </span>

  <span on:click={next} id="video-debug-forward" class:disable={disablePlayer}>
    <i class="fa fa-forward" />
  </span>

  <span class:disable={disablePlayer}>
    <i on:click={resetPlayer} class="fa fa-repeat" />
  </span>
  <div id="speed-control" class="menu-section">
    <label for="speed">Speed:</label>
    <input bind:value={speedDivisor} id="speed" type="range" min="1" max="10" />
  </div>
</div>
