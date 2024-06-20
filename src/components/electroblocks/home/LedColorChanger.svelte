<script lang="ts">
  import { onMount } from "svelte";
  import type { Element } from "@svgdotjs/svg.js";

  import { FormGroup, Input, Label, Button } from "@sveltestrap/sveltestrap";
  import {
    ledColors,
    lightColorsShades,
  } from "../../../blocks/led/virtual-circuit";

  let showLedChanger = false;
  let ledEl: Element;
  let pin: string;
  let ledColor;

  onMount(() => {
    document.addEventListener("led-color-show", (e: any) => {
      console.log("check details", e.detail);
      ledEl = e.detail.componentEl;
      pin = e.detail.pin;
      ledColor = ledEl.data("color");
      showLedChanger = true;
    });
  });

  function changeColor(e) {
    ledColor = e.target.getAttribute("data-color");
    let ledLightColor = lightColorsShades[ledColor];

    ledEl.data("color", ledColor);
    const mainColor = ledEl.findOne("#MAIN_COLOR") as Element;
    mainColor.fill(ledColor);
    const secondColorEl = ledEl.findOne("#SECOND_COLOR") as Element;
    secondColorEl.fill(ledLightColor);
  }

  function close() {
    showLedChanger = false;
    ledEl = null;
    pin = null;
  }
</script>

{#if showLedChanger}
  <section class="container" id="led-color-changer">
    <div class="row">
      <div class="col color-container">
        {#each ledColors as color (color)}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            class="color {color}"
            on:click={changeColor}
            style="background-color: {color};"
            data-color={color}
            class:selected={ledColor == color}
            id={color}
          ></div>
        {/each}
      </div>
    </div>
    <div class="row">
      <div class="col">
        <FormGroup>
          <Button id="close-btn-led" color="danger" on:click={close}>
            Close
          </Button>
        </FormGroup>
      </div>
    </div>
  </section>
{/if}

<style>
  #led-color-changer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background-color: #fff;
    z-index: 20;
  }
  :global(#close-btn-led) {
    width: 100%;
  }
  .color {
    flex: 1;
    margin: 2px;
    height: 30px;
    cursor: pointer;
  }
  .color-container {
    display: flex;
  }
  .selected {
    border: black 10px dashed;
  }
</style>
