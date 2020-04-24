<script>
  import { SVG } from "@svgdotjs/svg.js";

  import currentState from "../../../stores/currentState.store";

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
      .viewbox(0, 0, 500, 500)
      .panZoom(1, { zoomMin: 0.5, zoomMax: 20 });

    setTimeout(() => {
      draw.viewbox(0, 0, 200, 200);
    }, 2000);

    var rect = draw.svg(svgArduino).first();
    console.log(rect);
    rect.draggable();
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
