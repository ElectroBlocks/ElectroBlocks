<script>
  import Blockly from "blockly";
  import { onMount, onDestroy } from "svelte";

  import { WindowType, resizeStore } from "../../stores/resize.store";
  import startBlocly from "../../core/blockly/startBlockly";
  import currentFrameStore from "../../stores/currentFrame.store";

  import {
    arduinoLoopBlockShowLoopForeverText,
    arduinoLoopBlockShowNumberOfTimesThroughLoop
  } from "../../core/blockly/helpers/arduino_loop_block.helper";
  import {
    showSetupBlockDebugView,
    getWorkspace
  } from "../../core/blockly/helpers/workspace.helper";

  import { getBlockById } from "../../core/blockly/helpers/block.helper";

  // Controls whether to show the arduino loop block shows
  // the  loop forever text or loop number of times text
  export let showLoopExecutionTimesArduinoStartBlock = true;

  // The elment that contains blockly
  let blocklyElement;

  let workspaceInitialize = false;

  const unsubscribes = [];

  // This is ran whenever the showLoopExecutionTimesArduinoStartBlock changeq
  // and blocklyWorkspace is initialized
  $: if (showLoopExecutionTimesArduinoStartBlock && workspaceInitialize) {
    arduinoLoopBlockShowNumberOfTimesThroughLoop();
    showSetupBlockDebugView(true);
  } else if (workspaceInitialize) {
    arduinoLoopBlockShowLoopForeverText();
    showSetupBlockDebugView(false);
  }

  onMount(() => {
    // Hack for debugging blockly
    window.Blockly = Blockly;

    startBlocly(blocklyElement);

    workspaceInitialize = true;

    getWorkspace().addChangeListener(event => {
      if (event.type === Blockly.Events.BLOCK_CREATE) {
        if (showLoopExecutionTimesArduinoStartBlock && workspaceInitialize) {
          arduinoLoopBlockShowNumberOfTimesThroughLoop();
          showSetupBlockDebugView(true);
        } else if (workspaceInitialize) {
          arduinoLoopBlockShowLoopForeverText();
          showSetupBlockDebugView(false);
        }
      }
    });

    // Hack to make sure that once blockly loads it gets resized
    setTimeout(() => {
      resizeBlockly();
    }, 200);

    unsubscribes.push(
      currentFrameStore.subscribe(frame => {
        if (!frame) {
          return;
        }
        window.selectedBlock = getBlockById(frame.blockId);
        getBlockById(frame.blockId).select();
      })
    );
  });

  // List for resize main window event and resize blockly
  unsubscribes.push(
    resizeStore.subscribe(event => {
      if (event.type == WindowType.MAIN) {
        resizeBlockly();
        return;
      }
    })
  );

  // The function to resize blockly main window
  function resizeBlockly() {
    Blockly.svgResize(Blockly.getMainWorkspace());
  }

  onDestroy(() => {
    unsubscribes.forEach(unSubFunc => unSubFunc());
  });
</script>

<style>
  #blockly {
    height: 100%;
  }
</style>

<section bind:this={blocklyElement} id="blockly" />
