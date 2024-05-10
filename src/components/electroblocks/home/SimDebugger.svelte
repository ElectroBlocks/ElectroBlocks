<script>
  import { rgbToHex } from "../../../core/blockly/helpers/color.helper";
  import _ from "lodash";
  import currentFrameStore from "../../../stores/currentFrame.store";
  import frameStore from "../../../stores/frame.store";
  import { onDestroy } from "svelte";
  import { VariableTypes } from "../../../core/blockly/dto/variable.type";
  import { findComponent } from "../../../core/frames/transformer/frame-transformer.helpers";
  import { ArduinoComponentType } from "../../../core/frames/arduino.frame";

  let variables = [];

  const unsubscribes = [];

  let preRGBLEDColors = [];

  unsubscribes.push(
    currentFrameStore.subscribe((frame) => {
      if (!frame) {
        variables = [];
        preRGBLEDColors = [];
        return;
      }
      variables = _.keys(frame.variables).map((varName) => {
        return frame.variables[varName];
      });
      const fastLEDs = findComponent(frame, ArduinoComponentType.FASTLED_STRIP);
      if (fastLEDs) {
        preRGBLEDColors = fastLEDs.preShowLEDs;
      } else {
        preRGBLEDColors = [];
      }
    })
  );

  unsubscribes.push(
    frameStore.subscribe((frameContainer) => {
      // This means no frames so we should reset variables to none
      if (frameContainer.frames.length === 0) {
        variables = [];
        preRGBLEDColors = [];
        return;
      }
    })
  );

  function mapArrayValues(values, type) {
    const innerString = values
      .map((v) => (v === null ? "_" : v))
      .map((v) => {
        if (v === "_" || type !== VariableTypes.LIST_STRING) {
          return v;
        }

        return `"${v}"`;
      })
      .reduce((acc, next) => {
        return acc + next + ", ";
      }, "");

    return `[ ${innerString.substring(0, innerString.length - 2)} ]`;
  }

  onDestroy(() => {
    unsubscribes.forEach((unSubFunc) => unSubFunc());
  });
</script>

<div
  class:open={preRGBLEDColors.length > 0}
  id="debug-preshow-leds"
  class="debug-preshow-leds"
>
  <h3>Preview</h3>
  <div class="led-preivew-container">
    {#each _.chunk(preRGBLEDColors, 12) as row, i}
      <div class="row-led">
        <!-- to replicate the snake pattern on the preview-->
        {#each i % 2 == 1 ? row.reverse() : row as led}
          <span
            class="led-preview"
            style="background-color: {rgbToHex(led.color)};"
          />
        {/each}
      </div>
    {/each}
  </div>
</div>
<div class="debugger" class:open={variables.length > 0} id="debugger">
  <ul>
    {#each variables as variable}
      {#if ['Number', 'Boolean'].includes(variable.type)}
        <li>{variable.name} = {variable.value}</li>
      {/if}
      {#if ['String'].includes(variable.type)}
        <li>{variable.name} = "{variable.value}"</li>
      {/if}
      {#if ['List Number', 'List String', 'List Boolean'].includes(variable.type)}
        <li>
          {variable.name}
          =
          {mapArrayValues(variable.value, variable.type)}
        </li>
      {/if}
      {#if 'Colour' === variable.type}
        <li>
          <span
            class="color"
            style="border-bottom: {rgbToHex(variable.value)} solid 2px;"
          >
            {variable.name}
            = (r={variable.value.red},g={variable.value.green},b={variable.value.blue})
          </span>
        </li>
      {/if}
      {#if 'List Colour' === variable.type}
        <li>
          <span class="color-list-name-equal">{variable.name} =</span>
          {#each variable.value as color, i}
            {#if color}
              <span
                class="color-item"
                style="border: solid {rgbToHex(color)} 4px;"
              >
                {i + 1}
              </span>
            {:else}
              <span class="color-item" style="border: dotted gray 4px;">
                {i + 1}
              </span>
            {/if}
          {/each}
        </li>
      {/if}
    {/each}
  </ul>
</div>

<style>
  .debug-preshow-leds {
    box-sizing: border-box;
    position: absolute;
    right: 0;
    bottom: 0;
    max-width: 310px;
    padding: 5px;
    transform: translateX(300%) translateY(-100%);
    border: solid #d3d3d3 1px;
    border-bottom: none;
    background-color: white;
    transition: 1s ease-in-out transform;
  }
  .debugger {
    box-sizing: border-box;
    position: absolute;
    right: 0;
    top: 0;
    max-width: 300px;
    transform: translateX(300%);
    border: solid #d3d3d3 1px;
    border-bottom: none;
    background-color: white;
    transition: 1s ease-in-out transform;
  }
  .row-led {
    margin-top: 5px;
    display: flex;
  }
  .led-preivew-container {
    transform: rotateX(180deg);
  }
  .led-preview {
    padding: 5px;
    margin-left: 5px;
    margin-top: 5px;
    width: 20px;
    height: 20px;
  }
  .debug-preshow-leds.open,
  .debugger.open {
    transform: translateX(0);
  }
  ul {
    list-style-type: none;
    padding: 0;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  ul li {
    border-bottom: solid gray 1px;
    padding: 10px;
    overflow-wrap: break-word;
  }
  .color {
    background-color: #fff;
  }
  .color-item {
    padding: 5px;
    margin-left: 5px;
    display: inline-block;
    margin-top: 5px;
  }
  .color-list-name-equal {
    display: inline-block;
  }
</style>
