<script lang="ts">
  import { onMount } from "svelte";
  import type { Element } from "@svgdotjs/svg.js";

  import { FormGroup, Input, Label, Button } from "@sveltestrap/sveltestrap";

  let showLedChanger = false;
  let ledEl: Element;
  let pin: string;
  let ledColor;
  onMount(() => {
    document.addEventListener("led-color-show", (e) => {
      console.log("check details", e.detail);
      ledEl = e.detail.componentEl;
      pin = e.detail.pin;
      ledColor = ledEl.data("color");
      showLedChanger = true;
    });
  });

  function changeColor(e) {
    const color = e.target.value;
    ledEl
      .find(`#radial-gradient-${pin} stop`)
      .toArray()
      .find((stopEl) => +stopEl.attr("offset") === 1)
      .attr("stop-color", color);

    ledEl.data("color", color);
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
      <div class="col-6">
        <FormGroup>
          <Label for="led-color">Led Color</Label>
          <Input
            bind:value={ledColor}
            on:input={changeColor}
            type="color"
            id="led-color"
          />
        </FormGroup>
      </div>
      <div class="col-6">
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
    margin-top: 31px;
  }
</style>
