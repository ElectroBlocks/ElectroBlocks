<script>
  import Blockly from 'blockly';
  import { onMount, onDestroy } from 'svelte';

  import { WindowType, resizeStore } from '../../stores/resize.store';
  import startBlockly from '../../core/blockly/startBlockly';
  import currentFrameStore from '../../stores/currentFrame.store';
  import { usbMessageStore } from '../../stores/arduino.store';
  import settingsStore from '../../stores/settings.store';
  import {
    arduinoLoopBlockShowLoopForeverText,
    arduinoLoopBlockShowNumberOfTimesThroughLoop,
  } from '../../core/blockly/helpers/arduino_loop_block.helper';

  import {
    getAllBlocks,
    getBlockById,
  } from '../../core/blockly/helpers/block.helper';
  import updateLoopblockStore from '../../stores/update-loopblock.store';
  import { workspaceToXML } from '../../core/blockly/helpers/workspace.helper';
  import { getToolBoxString } from '../../core/blockly/toolbox';

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
  } 
  
  $: if (!showLoopExecutionTimesArduinoStartBlock && workspaceInitialize) {
    arduinoLoopBlockShowLoopForeverText();
  }

  onMount(() => {
    // Hack for debugging blockly
    window.Blockly = Blockly;

    startBlockly(blocklyElement, $settingsStore.boardType, $settingsStore.language);

    workspaceInitialize = true;
    resizeBlockly();
    // Hack to make sure that once blockly loads it gets resized
    setTimeout(() => {
      resizeBlockly();
    }, 200);

    unsubscribes.push(
      currentFrameStore.subscribe((frame) => {
        if (!frame) return;
        getAllBlocks().forEach((b) => b.unselect());
        const selectedBlock = getBlockById(frame.blockId);
        if (selectedBlock) {
          selectedBlock.select();
        }
      })
    );

    unsubscribes.push(
      updateLoopblockStore.subscribe(() => {
        if (showLoopExecutionTimesArduinoStartBlock && workspaceInitialize) {
          arduinoLoopBlockShowNumberOfTimesThroughLoop();
        } else if (workspaceInitialize) {
          arduinoLoopBlockShowLoopForeverText();
        }
      })
    );
  });

  // List for resize main window event and resize blockly
  unsubscribes.push(
    resizeStore.subscribe((event) => {
      if (event.type == WindowType.MAIN) {
        resizeBlockly();
        return;
      }
    })
  );
  

  unsubscribes.push(settingsStore.subscribe((settings) => {
    if (!settings) {
      return;
    }

    blocklyReloadToolbox(getToolBoxString(settings.boardType, settings.language));
  }));

  unsubscribes.push(
    usbMessageStore.subscribe((m) => {
      if (!m) {
        return;
      }

      if (m.type === 'Computer') {
        return;
      }

      if (m.message.indexOf('DEBUG_BLOCK_') === -1) {
        return;
      }

      const blockId = m.message.replace('DEBUG_BLOCK_', '').trim();

      getAllBlocks().forEach((b) => b.unselect());
      const selectedBlock = getBlockById(blockId);
      if (selectedBlock) {
        selectedBlock.select();
      } else {
        console.log(blockId, 'blockId');
      }
    })
  );

  // The function to resize blockly main window
  function resizeBlockly() {
    Blockly.svgResize(Blockly.getMainWorkspace());
  }

  function blocklyReloadToolbox(xmlToolbox) {
    if (workspaceInitialize) {
      Blockly.getMainWorkspace().updateToolbox(xmlToolbox);
    }
  }

  onDestroy(() => {
    unsubscribes.forEach((unSubFunc) => unSubFunc());
    if (!workspaceInitialize) {
      return;
    }
    const recentBlocks = workspaceToXML();
    localStorage.setItem('reload_once_workspace', recentBlocks);
  });
</script>

<section bind:this={blocklyElement} id="blockly" />

<style>
  #blockly {
    height: 100%;
  }
</style>
