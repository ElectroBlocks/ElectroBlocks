<script>
  import { SVG } from "@svgdotjs/svg.js";

  import currentState from "../../../stores/currentState.store";
  import { resizeStore } from "../../../stores/resize.store";

  import svgArduino from "./arduino-breadboard-wired-2.svg";
  // What if we made everything a series of components.
  import { onMount } from "svelte";
  let state;
  let container;
  let svgContainer;
  onMount(async () => {
    await import("@svgdotjs/svg.draggable.js");
    await import("@svgdotjs/svg.panzoom.js");
    var draw = SVG()
      .addTo(container)
      .size(container.clientWidth * 0.9, container.clientHeight * 0.9)
      .viewbox(0, 0, container.clientWidth * 0.9, container.clientHeight * 0.8)
      .panZoom();

    var rect = draw.svg(svgArduino).first();
    console.log(rect);
    rect.draggable();

    resizeStore.subscribe(() => {
      draw
        .size(container.clientWidth * 0.9, container.clientHeight * 0.9)
        .viewbox(
          0,
          0,
          container.clientWidth * 0.9,
          container.clientHeight * 0.8
        );
    });
  });
  currentState.subscribe(currentState => {
    state = currentState;
  });
</script>

<style>
  #simulator {
    width: 100%;
    height: 100%;
  }
</style>

<div bind:this={container} id="simulator" />
