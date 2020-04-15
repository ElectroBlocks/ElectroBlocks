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
    var draw = SVG()
      .addTo(container)
      .size("100%", "100%");
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
    background-color: brown;
  }
</style>

<div bind:this={container} id="simulator" />
