<script>
  import { onMount, afterUpdate } from "svelte";
  import { get } from "svelte/store";
  import codeStore from "../../../stores/code.store";
  import boardStore from "../../../stores/board.store"; // Board selection store


  import hljs from 'highlight.js/lib/core';
  
  //Import hljs generator for python
  import arduinoLang from 'highlight.js/lib/languages/arduino';
  import pythonLang from 'highlight.js/lib/languages/python';
  
  import 'highlight.js/styles/arduino-light.css';
  import 'highlight.js/styles/a11y-light.css';

  import { tooltip } from "@svelte-plugins/tooltips";

  // Importing settings store
  import settingsStore from "../../../stores/settings.store";

  let code = "";
  let loaded = false;
  let fontSize = 14;
  let hasCopiedCode = false;
<<<<<<< HEAD

  // subscribing to the settings store
  let settings = get(settingsStore);
  settingsStore.subscribe((newSettings) => {
    settings = newSettings;
  });

  onMount(async () => {
    hljs.registerLanguage('arduino', arduinoLang);
    hljs.registerLanguage('python', pythonLang);
    codeStore.subscribe(async (codeInfo) => {
      try {
        if (settings.language==="Python") {
          code = hljs.highlight(codeInfo.pythonLang, { language: 'python'}).value;
        } else {
          // @ts-ignore
          code =  hljs.highlight(codeInfo.cLang, { language: 'arduino' }).value;
        }
      }catch(e)
      {
=======
  let isBluetoothEnabled = true; // Default: enabled
  let selectedBoard = "Arduino Uno"; // Default selected board
  let workspace; // Blockly workspace reference

  // Toolboxes for different boards
  const unoToolbox = `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <category name="Logic" colour="#5C81A6">
        <block type="controls_if"></block>
        <block type="logic_compare"></block>
      </category>
      <category name="Loops" colour="#5CA65C">
        <block type="controls_repeat_ext"></block>
      </category>
      <category name="Arduino Uno" colour="#FFA500">
        <block type="arduino_uno_digital_write"></block>
      </category>
    </xml>
  `;

  const megaToolbox = `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <category name="Logic" colour="#5C81A6">
        <block type="controls_if"></block>
      </category>
      <category name="Loops" colour="#5CA65C">
        <block type="controls_repeat_ext"></block>
      </category>
      <category name="Arduino Mega" colour="#FF4500">
        <block type="arduino_mega_digital_write"></block>
      </category>
    </xml>
  `;

  // Inject Blockly into the container
  function injectBlockly(toolboxXml) {
    if (workspace) {
      workspace.dispose();
    }

    const toolbox = Blockly.Xml.textToDom(toolboxXml);

    workspace = Blockly.inject('blocklyDiv', {
      toolbox: toolbox,
      grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
      trashcan: true,
      zoom: { controls: true, wheel: true }
    });
  }

  // Update the Blockly workspace whenever the board changes
  function handleBoardChange(board) {
    selectedBoard = board;

    if (board === "Arduino Mega") {
      isBluetoothEnabled = false;
      injectBlockly(megaToolbox);
    } else if (board === "Arduino Uno") {
      isBluetoothEnabled = true;
      injectBlockly(unoToolbox);
    } else {
      console.log(`Unknown board: ${board}`);
    }
  }

  onMount(async () => {
    hljs.registerLanguage('arduino', arduinoLang);

    // Subscribe to code updates
    codeStore.subscribe(async (codeInfo) => {
      try {
        code = hljs.highlight(codeInfo.code, { language: 'arduino' }).value;
      } catch (e) {
>>>>>>> 65c3033 (fixed_toolbox_visibility)
        console.log(e);
      }
    });

    // Subscribe to board selection changes
    boardStore.subscribe(board => {
      handleBoardChange(board);
    });

    // Initial Blockly injection for default board
    injectBlockly(unoToolbox);

    loaded = true;
  });

  afterUpdate(() => {
    if (loaded) {
      try {
        hljs.highlightAll();
      } catch (error) {
        console.log(error, 'error');
      }
    }
  });

  function zoomIn() {
    fontSize += 2;
  }

  function zoomOut() {
    fontSize -= 2;
  }

  function copy() {
    if (settings.language==="Python") {
      navigator.clipboard.writeText(get(codeStore).cLang);
    } else {
      // @ts-ignore
      navigator.clipboard.writeText(get(codeStore).pythonLang);
    }
    hasCopiedCode = true;
  }

  const navTooltipStyleCodeSmallMarginBottom = {
    position: "bottom",
    align: "center",
    animation: "slide",
    theme: "code-small-margin",
  };
  const navTooltipStyleSmallMargin = {
    position: "bottom",
    align: "center",
    animation: "slide",
    theme: "code-large-margin",
  };
</script>

<!-- Blockly & Code Controls -->
<div class="row">
  <div class="col">
    {#if !hasCopiedCode}
      <i use:tooltip={navTooltipStyleSmallMargin} title="Copy Code" on:click={copy} class="fa fa-clipboard" aria-hidden="true"></i>
    {:else}
      <i use:tooltip={navTooltipStyleSmallMargin} title="Copied" on:mouseleave={() => hasCopiedCode = false} on:click={copy} class="fa fa-clipboard" aria-hidden="true"></i>
    {/if}

    <i use:tooltip={navTooltipStyleCodeSmallMarginBottom} on:click={zoomOut} title="Zoom Out" class="fa fa-search-minus float-end me-4" aria-hidden="true"></i>

    <i use:tooltip={navTooltipStyleSmallMargin} on:click={zoomIn} title="Zoom In" class="fa fa-search-plus float-end" aria-hidden="true"></i>
  </div>
</div>

<!-- Bluetooth Status -->
<p class="bluetooth-status">
  Bluetooth: <strong>{isBluetoothEnabled ? "Enabled" : "Disabled"}</strong>
</p>

<!-- Code Viewer -->
<pre style="font-size: {fontSize}px">
<<<<<<< HEAD
  <code class="{settings.language === 'Python' ? 'language-python' : 'language-arduino'}">{@html code}</code>
  </pre>
=======
  <code class="language-arduino">{@html code}</code>
</pre>

<!-- Blockly Workspace -->
<div id="blocklyDiv" style="height: 480px; width: 100%; margin: 20px auto;"></div>

>>>>>>> 65c3033 (fixed_toolbox_visibility)
<svelte:head>
  <title>ElectroBlocks - Code</title>
</svelte:head>

<style>
  pre {
    margin: 0;
    padding: 0;
    height: 100vh;
  }
  code {
    margin-left: 10px;
    height: 100vh;
    overflow: scroll;
  }
  i {
    font-size: 30px;
    margin-left: 20px;
    cursor: pointer;
    margin-bottom: 10px;
  }
  :global(.tooltip.code-small-margin) {
    margin-top: 10px;
  }
  :global(.tooltip.code-large-margin) {
    margin-top: 30px;
  }
  .bluetooth-status {
    font-size: 16px;
    margin-left: 20px;
    color: #333;
  }
  #blocklyDiv {
    border: 1px solid #ddd;
    background-color: #f9f9f9;
  }
</style>

