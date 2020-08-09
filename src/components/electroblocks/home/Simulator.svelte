<script>
  import SimDebugger from "./SimDebugger.svelte";
  import { SVG } from "@svgdotjs/svg.js";
  import frameStore from "../../../stores/frame.store";
  import currentFrameStore from "../../../stores/currentFrame.store";
  import settingsStore from "../../../stores/settings.store";
  import { resizeStore } from "../../../stores/resize.store";
  import paint from "../../../core/virtual-circuit/paint.ts";
  import update from "../../../core/virtual-circuit/update.ts";
  // What if we made everything a series of components.
  import { onMount } from "svelte";
  let container;
  let svgContainer;
  let virtualCircuit;
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
      .size(container.clientWidth - 10, container.clientHeight - 10)
      .viewbox(0, 0, container.clientWidth - 10, container.clientWidth - 10)
      .panZoom();

    frameStore.subscribe(newFrames => {
      frames = newFrames;
      console.log(frames, "new frames");
      const lastFrame = frames ? frames[frames.length - 1] : undefined;
      const firstFrame = frames ? frames[0] : undefined;
      currentFrame = firstFrame;
      paint(draw, lastFrame);
      update(draw, firstFrame);
    });

    currentFrameStore.subscribe(frame => {
      currentFrame = frame;
      update(draw, currentFrame);
    });

    resizeStore.subscribe(() => {
      draw.size(container.clientWidth - 10, container.clientHeight - 10);
    });
  });
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
  .container {
    background-color: #d9e4ec;
  }
  #simulator {
    width: calc(100% - 10px);
    height: calc(100% - 10px);
  }
</style>

<div class="container">
  <div bind:this={container} id="simulator" />
  <SimDebugger />
</div>
