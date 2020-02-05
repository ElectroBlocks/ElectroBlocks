<script lang="typescript">
  import Blockly from "blockly";
  import { onMount } from "svelte";

  import { WindowType, resizeStore } from "../../stores/resize-store";
  import settingsStore from "../../stores/settings-store";
  import startBlocly from "../../blockly/startBlockly";

  import {
    arduinoLoopBlockShowLoopForeverText,
    arduinoLoopBlockShowNumberOfTimesThroughLoop
  } from "../../blockly/helpers/arduino_loop_block";

  import {
    showArduinoSetupBlock,
    removeArduinoSetupBlock
  } from "../../blockly/helpers/arduino_setup_block";

  // Controls whether to show the arduino loop block shows
  // the  loop forever text or loop number of times text
  export let showLoopExecutionTimesArduinoStartBlock = true;

  // The elment that contains blockly
  let blocklyElement: HTMLElement;

  let workspaceInitialize = false;

  // This is ran whenever the showLoopExecutionTimesArduinoStartBlock changeq
  // and blocklyWorkspace is initialized
  $: if (showLoopExecutionTimesArduinoStartBlock && workspaceInitialize) {
    arduinoLoopBlockShowNumberOfTimesThroughLoop();
  } else if (workspaceInitialize) {
    arduinoLoopBlockShowLoopForeverText();
  }

  onMount(() => {
    // Hack for debugging blockly
    (window as any).Blockly = Blockly;

    startBlocly(blocklyElement);

    workspaceInitialize = true;

    settingsStore.refreshSettingsWithLocalStorage();
    // Hack to make sure that once blockly loads it gets resized
    setTimeout(() => {
      resizeBlockly();
    }, 200);

    // We don't have to unsubscribe because this block is always visible
    settingsStore.subscribe(settings => {
      if (settings.showSetupBlock) {
        showArduinoSetupBlock();
        return;
      }
      removeArduinoSetupBlock();
    });
  });

  // List for resize main window event and resize blockly
  resizeStore.subscribe(event => {
    if (event.type == WindowType.MAIN) {
      resizeBlockly();
      return;
    }
  });

  // The function to resize blockly main window
  function resizeBlockly() {
    Blockly.svgResize(Blockly.getMainWorkspace() as Blockly.WorkspaceSvg);
  }
</script>

<style>
  #blockly {
    height: 100%;
  }
</style>

<section bind:this={blocklyElement} id="blockly" />
