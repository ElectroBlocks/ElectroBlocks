<script lang="ts">
  import type { Lesson } from "../../../lessons/lesson.model";
  import { createEventDispatcher } from "svelte";
  export let top = 300;
  export let left = 300;
  export let lesson: Lesson;

  const dispatcher = createEventDispatcher();
  let stepIndex = 0;
  let closeP;

  $: stepIndex =
    lesson && lesson.steps.length <= stepIndex && stepIndex > 0
      ? lesson.steps.length - 1
      : stepIndex;
  $: currentStep = lesson && lesson.steps[stepIndex];
  $: isYoutube = currentStep && ["youtube"].includes(currentStep.contentType);
  $: isImage =
    currentStep && ["png", "gif", "jpg"].includes(currentStep.contentType);
  $: url =
    currentStep && lesson
      ? `http://localhost:3000/lessons/${lesson.authorFolderName}/${
          lesson.folderName
        }/step-${stepIndex + 1}.${currentStep.contentType}`
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

  function close() {
    dispatcher("close");
  }

  let moving = false;
  let offsetX = 0;
  let offsetY = 0;
  let layerY;
  function startMove(e) {
    moving = true;
    ({ offsetY, offsetX, layerY } = e);
  }

  function move(e) {
    if (moving) {
      console.log(closeP.clientHeight);
      debugger;
      top = e.pageY - closeP.clientHeight - offsetY;
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
    height: 500px;
    margin: 0;
    border-radius: 4px;
    position: absolute;
    right: -30px;
  }
  section#header {
    display: flex;
    justify-content: space-around;
    height: 40px;
    background-color: #505bda;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    cursor: move;
    margin: 0;
  }
  section#header span {
    border-radius: 7.5px;
    width: 15px;
    height: 15px;
    background-color: #fff;
    margin-top: 12.5px;
  }
  section#header span.active {
    background-color: #ffaac3;
  }
  img {
    width: 560px;
    height: 315px;
  }
  h3#text {
    text-align: center;
    background-color: #fff;
    padding: 6px;
    margin: 0;
  }

  section#controls {
    display: flex;
    justify-content: space-evenly;
  }
  section#controls button {
    flex: 1;
  }

  button {
    margin: 5px;
    border: none;
    border-radius: 2px;
    font-size: 20px;
    padding: 0 10px;
    width: 50px;
    height: 40px;
    margin-top: 10px;
    cursor: pointer;
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
  p#close {
    text-align: right;
    font-size: 20px;
    margin-right: 5px;
    cursor: pointer;
    margin: 5px;
    height: 28px;
  }
</style>

<section style="left: {left}px; top: {top}px;" id="lesson">
  <p on:click={close} bind:this={closeP} id="close">close</p>
  <section on:mousedown={startMove} id="header">
    {#if lesson.steps.length > 1}
      {#each lesson.steps as step, index}
        <span class:active={stepIndex == index} data-step={index} />
      {/each}
    {/if}
  </section>
  {#if currentStep.title !== ''}
    <h3 id="text">{currentStep.title}</h3>
  {/if}
  {#if isYoutube}
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

  {#if isImage}<img src={url} alt="step {stepIndex + 1}" id="main-image" />{/if}
  {#if lesson.steps.length > 1}
    <section id="controls">
      <button on:click={moveBack} disabled={stepIndex === 0} id="back">
        <i class="fa fa-arrow-left" aria-hidden="true" />
      </button>
      <button
        on:click={moveForward}
        disabled={stepIndex === lesson.steps.length - 1}
        id="forward">
        <i class="fa fa-arrow-right" aria-hidden="true" />
      </button>
    </section>
  {/if}
</section>
<svelte:body on:mousemove={move} on:mouseup={stopMove} />
