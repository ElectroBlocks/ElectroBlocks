<script>
  import { SVG } from "@svgdotjs/svg.js";
  import "./test.js";
  import currentState from "../../../stores/currentState.store";
  import stateStore from "../../../stores/state.store";
  import currentStateStore from "../../../stores/currentState.store";
  import { resizeStore } from "../../../stores/resize.store";
  import paint from "../../../core/virtual-circuit/paint.ts";
  import update from "../../../core/virtual-circuit/update.ts";
  // What if we made everything a series of components.
  import { onMount } from "svelte";
  let container;
  let svgContainer;
  let virtualCircuit;
  onMount(async () => {
    await import("@svgdotjs/svg.draggable.js");

    await import("@svgdotjs/svg.panzoom.js");

    // THE VIEWBOX MUST BE THE SAME SIZE AS THE COMPONENT OR VIEW
    // OTHERWISE WE DEAL WITH 2 COORDINATE SYSTEMS AND MATRIX MATH
    // DON'T DO IT!!!!!
    var draw = SVG()
      .addTo(container)
      .size(container.clientWidth * 0.95, container.clientHeight * 0.95)
      .viewbox(0, 0, container.clientWidth * 0.95, container.clientWidth * 0.95)
      .panZoom();

    stateStore.subscribe(frames => {
      setTimeout(() => {
        // Make Sure Everything Loaded before calculating width and heights
        paint(draw, frames[frames.length - 1]);
        update(draw, frames[0]);
      }, 10);
    });

    currentStateStore.subscribe(frame => {
      update(draw, frame);
    });

    resizeStore.subscribe(() => {
      draw
        .size(container.clientWidth * 0.95, container.clientHeight * 0.95)
        .viewbox(0, 0, draw.width(), draw.height());
    });
  });
</script>

<style>
  #simulator {
    width: 100%;
    height: 100%;
  }
</style>

<div bind:this={container} id="simulator" />
