<script>
  import { createEventDispatcher } from "svelte";
  export let top = 300;
  export let left = 300;
  export let lesson;
  let min = false;

  const dispatcher = createEventDispatcher();
  let stepIndex = 0;

  $: stepIndex =
    lesson && lesson.steps.length <= stepIndex && stepIndex > 0
      ? lesson.steps.length - 1
      : stepIndex;
  $: currentStep = lesson && lesson.steps[stepIndex];
  $: url = lesson
    ? `/lessons/${lesson.authorFolderName}/${lesson.folderName}/step-${
        stepIndex + 1
      }.${currentStep.contentType}`
    : "";

  function moveBack() {
    if (stepIndex > 0) {
      stepIndex -= 1;
    }
  }

  function moveForward() {
    if (stepIndex <= lesson.steps.length - 2) {
      stepIndex += 1;
    }
  }

  function onClose() {
    dispatcher("close");
  }

  function onMin() {
    min = !min;
  }

  let moving = false;
  let offsetX = 0;
  let offsetY = 0;
  function startMove(e) {
    if (e.target.tagName === "BUTTON" || e.target.tagName === "I") {
      return;
    }
    moving = true;
    offsetY = e.offsetY + e.target.offsetTop;
    offsetX = e.offsetX + e.target.offsetLeft;
  }

  function move(e) {
    if (moving) {
      top = e.pageY - offsetY;
      left = e.pageX - offsetX;
    }
  }

  function stopMove() {
    moving = false;
    console.log("stop");
  }
</script>

<style>
  section#lesson {
    width: 560px;
    margin: 0;
    border-radius: 4px;
    position: absolute;
    right: -30px;
    z-index: 200;
    user-select: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    cursor: move;
  }

  section#header {
    justify-content: space-around;
    height: 40px;
    background-color: #505bda;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    margin: 0;
    position: relative;
  }
  section#header #right-btn-container {
    position: absolute;
    top: 4px;
    left: 8px;
    font-size: 16px;
  }

  section#header #circles {
    display: flex;
    width: 200px;
    height: 10px;
    justify-content: space-evenly;
    position: absolute;
    top: 14px;
    left: 180px;
  }
  section#header #circles span {
    border-radius: 5px;
    width: 10px;
    height: 10px;
    background-color: #fff;
  }
  section#header #circles span.active {
    background-color: #ffaac3;
  }

  iframe {
    background-color: #fff;
  }
  img {
    width: 560px;
  }
  h3#text {
    text-align: center;
    background-color: #fff;
    padding: 6px;
    margin: 0;
    font-size: 1.5em;
    background-color: #fff;
  }

  section#controls {
    display: flex;
    justify-content: space-evenly;
    background-color: #fff;
    margin-top: -8px;
  }
  section#controls button {
    flex: 1;
  }

  button {
    margin: 5px;
    border: none;
    border-radius: 2px;
    font-size: 20px;
    padding: 5px 10px;
    cursor: pointer;
  }
  button.sm {
    padding: 0 10px;
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
    background-color: rgb(251, 251, 247);
  }
  button:disabled i {
    font-size: 20px;
  }
</style>

<section
  on:mousedown={startMove}
  style="left: {left}px; top: {top}px;"
  id="lesson">
  <section id="header">
    <div id="right-btn-container">
      <button class="sm" on:click|stopPropagation|preventDefault={onClose}>
        <i class="fa fa-times" aria-hidden="true" />
      </button>
      <button class="sm" on:click|stopPropagation|preventDefault={onMin}>
        <i class="fa fa-window-minimize" aria-hidden="true" />
      </button>
    </div>

    <div id="circles">
      {#if lesson.steps.length > 1}
        {#each lesson.steps as step, index}
          <span class:active={stepIndex == index} data-step={index} />
        {/each}
      {/if}
    </div>
  </section>
  {#if !min}
    {#if currentStep.title !== '' && currentStep.contentType !== 'youtube'}
      <h3 id="text">{currentStep.title}</h3>
    {/if}
    {#if currentStep.contentType === 'youtube'}
      <iframe
        title={currentStep.title}
        width="560"
        height="315"
        src="https://www.youtube.com/embed/{currentStep.youtubeId}"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope;
      picture-in-picture"
        allowfullscreen />
    {/if}

    {#if currentStep.contentType !== 'youtube'}
      <!-- This was done to prevent dragging the image -->
      <img
        on:dragstart|preventDefault={(e) => console.log('prevented')}
        src={url}
        alt="step {stepIndex + 1}"
        id="main-image" />
    {/if}
    {#if lesson.steps.length > 1}
      <section id="controls">
        <button
          on:click|stopPropagation|preventDefault={moveBack}
          disabled={stepIndex === 0}
          id="back">
          <i class="fa fa-arrow-left" aria-hidden="true" />
        </button>
        <button
          on:click|stopPropagation|preventDefault={moveForward}
          disabled={stepIndex === lesson.steps.length - 1}
          id="forward">
          <i class="fa fa-arrow-right" aria-hidden="true" />
        </button>
      </section>
    {/if}
  {/if}
</section>
<svelte:body on:mousemove={move} on:mouseup={stopMove} />
