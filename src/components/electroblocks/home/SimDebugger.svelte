<script>
  export let show = false;
  import { rgbToHex } from "../../../core/blockly/helpers/color.helper";
  import _ from "lodash";
  import currentFrameStore from "../../../stores/currentFrame.store";
  let variables = [];
  currentFrameStore.subscribe(frame => {
    if (!frame) {
      variables = [];
      return;
    }
    variables = _.keys(frame.variables).map(varName => {
      return frame.variables[varName];
    });
  });
</script>

<style>
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
</style>

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
        <li>{variable.name} = {JSON.stringify(variable.value)}</li>
      {/if}
      {#if 'Colour' === variable.type}
        <li>
          <span
            class="color"
            style="border-bottom: {rgbToHex(variable.value)} solid 2px;">
            {variable.name} = (r={variable.value.red},g={variable.value.green},b={variable.value.blue})
          </span>
        </li>
      {/if}
    {/each}
  </ul>

</div>
