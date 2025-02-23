<script>
  import { onMount, afterUpdate } from "svelte";
  import { get } from "svelte/store";
  import codeStore from "../../../stores/code.store";
  import boardStore from "../../../stores/board.store"; // Import board selection store

  import hljs from 'highlight.js/lib/core';
  import arduinoLang from 'highlight.js/lib/languages/arduino';
  import 'highlight.js/styles/arduino-light.css';
  import 'highlight.js/styles/a11y-light.css';

  import { tooltip } from "@svelte-plugins/tooltips";

  let code = "";
  let loaded = false;
  let fontSize = 14;
  let hasCopiedCode = false;
  let isBluetoothEnabled = true; // Default: enabled

  onMount(async () => {
    hljs.registerLanguage('arduino', arduinoLang);
    
    // Subscribe to code updates
    codeStore.subscribe(async (codeInfo) => {
      try {
        code = hljs.highlight(codeInfo.code, { language: 'arduino' }).value;
      } catch (e) {
        console.log(e);
      }
    });

    // Subscribe to board selection changes
    boardStore.subscribe(board => {
      if (board === "Arduino Mega") {
        isBluetoothEnabled = false; // Disable Bluetooth for Mega
      } else if (board === "Arduino Uno") {
        isBluetoothEnabled = true; // Enable Bluetooth for Uno
      }
    });

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
    navigator.clipboard.writeText(get(codeStore).code);
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

<!-- Display Bluetooth status -->
<p class="bluetooth-status">
  Bluetooth: <strong>{isBluetoothEnabled ? "Enabled" : "Disabled"}</strong>
</p>

<pre style="font-size: {fontSize}px">
  <code class="language-arduino">{@html code}</code>
</pre>

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
</style>
