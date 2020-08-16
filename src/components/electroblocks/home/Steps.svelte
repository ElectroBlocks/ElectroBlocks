<script>
  import frameStore from "../../../stores/frame.store";
  import currentStepStore from "../../../stores/currentStep.store";
  import { afterUpdate } from "svelte";
  import currentFrameStore from "../../../stores/currentFrame.store";
  import { onDestroy, onMount } from "svelte";

  let stepContainer;
  let frames = [];
  let unsubscribes = [];

  unsubscribes.push(
    frameStore.subscribe(newFrames => {
      frames = newFrames;
    })
  );

  onDestroy(() => {
    unsubscribes.forEach(unSubFunc => unSubFunc());
  });

  afterUpdate(() => {
    const activeStep = stepContainer.querySelector(".active");
    if (activeStep) {
      activeStep.scrollIntoView({ block: "center" });
    }
  });

  function changeFrame(e) {
    const currentFrameIndex = +e.target.getAttribute("data-step");

    currentFrameStore.set(frames[currentFrameIndex]);
    currentStepStore.set(currentFrameIndex);
  }
</script>

<style>
  #steps {
    width: 100%;
    min-height: 100%;
    background: #242323;
    color: #eff0f1;
  }
  ol {
    margin: 0;
    padding: 20px;
    padding-left: 40px;
    list-style: none;
    counter-reset: my-awesome-counter;
  }
  li {
    padding: 3px;
    counter-increment: my-awesome-counter;
    font-size: 1em;
    cursor: pointer;
    margin-top: 10px;
  }
  li::before {
    content: "Step " counter(my-awesome-counter) ". ";
    font-weight: 600;
    font-size: 1em;
    color: plum;
  }
  li.active,
  li.active::before {
    background: steelblue;
    border-radius: 2px;
    padding: 3px;
  }
</style>

<div bind:this={stepContainer} id="steps">
  <ol>
    {#each $frameStore as frame, i}
      <li
        data-step={i}
        on:click={changeFrame}
        class:active={i === $currentStepStore}>
        {frame.explanation}
      </li>
    {/each}
  </ol>
</div>
