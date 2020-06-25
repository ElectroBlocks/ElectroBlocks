<script>
  import SimDebugger from "./SimDebugger.svelte";
  import ToggleSwitch from "../../UI/ToggleSwitch.svelte";
  import { SVG } from "@svgdotjs/svg.js";
  import frameStore from "../../../stores/frame.store";
  import currentFrameStore from "../../../stores/currentFrame.store";

  import { resizeStore } from "../../../stores/resize.store";
  import paint from "../../../core/virtual-circuit/paint.ts";
  import update from "../../../core/virtual-circuit/update.ts";
  // What if we made everything a series of components.
  import { onMount } from "svelte";
  let container;
  let svgContainer;
  let virtualCircuit;
  let showDebugger = true;
  let showArduino = true;
  let frames = [];
  let currentFrame = undefined;
  let draw;
  onMount(async () => {
    await import("@svgdotjs/svg.draggable.js");

    await import("@svgdotjs/svg.panzoom.js");

    // THE VIEWBOX MUST BE THE SAME SIZE AS THE COMPONENT OR VIEW
    // OTHERWISE WE DEAL WITH 2 COORDINATE SYSTEMS AND MATRIX MATH
    // DON'T DO IT!!!!!
    draw = SVG()
      .addTo(container)
      .size(container.clientWidth * 0.95, container.clientHeight * 0.95)
      .viewbox(0, 0, container.clientWidth * 0.95, container.clientWidth * 0.95)
      .panZoom();

    frameStore.subscribe(newFrames => {
      frames = newFrames;
      console.log(frames, "new frames");
      const lastFrame = frames ? frames[frames.length - 1] : undefined;
      const firstFrame = frames ? frames[0] : undefined;
      currentFrame = firstFrame;
      paint(draw, lastFrame, showArduino);
      update(draw, firstFrame, showArduino);
    });

    currentFrameStore.subscribe(frame => {
      currentFrame = frame;
      update(draw, currentFrame, showArduino);
    });

    resizeStore.subscribe(() => {
      draw.size(container.clientWidth * 0.95, container.clientHeight * 0.95);
    });
  });

  $: onShowArduino(showArduino);

  function onShowArduino(showArduino) {
    if (!draw) {
      return;
    }
    console.log("show arduino called", showArduino);
    const lastFrame = frames ? frames[frames.length - 1] : undefined;
    paint(draw, lastFrame, showArduino);
    update(draw, currentFrame, showArduino);
  }
</script>

<style>
  .container,
  #simulator {
    width: 100%;
    height: 100%;
    position: relative;
    top: 0;
    left: 0;
  }
  #simulator {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
  }
</style>

<div class="container">
  <div bind:this={container} id="simulator" />
  <SimDebugger show={showDebugger} />
  <div id="controls">
    <ToggleSwitch bind:checked={showArduino} label="Show Arduino" />
    <ToggleSwitch bind:checked={showDebugger} label="Show Variables" />
  </div>
</div>
