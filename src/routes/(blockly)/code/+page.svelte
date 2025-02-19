<script>
  import { onMount } from "svelte";
  import codeStore from "../../../stores/code.store";
  import hljs from 'highlight.js/lib/core';
  
  //Import hljs generator for python
  import arduinoLang from 'highlight.js/lib/languages/arduino';
  import pythonLang from 'highlight.js/lib/languages/python';
  
  import 'highlight.js/styles/arduino-light.css';
  import 'highlight.js/styles/a11y-light.css';

  import { afterUpdate } from "svelte";
  import { tooltip } from "@svelte-plugins/tooltips";
  import { get } from "svelte/store";

  // Importing settings store
  import settingsStore from "../../../stores/settings.store";

  let code = "";
  let loaded = false;
  let fontSize = 14;
  let hasCopiedCode = false;

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
          code = hljs.highlight(codeInfo.code, { language: 'python'}).value;
        } else {
          // @ts-ignore
          code =  hljs.highlight(codeInfo.code,{ language: 'arduino' }).value;
        }
      }catch(e)
      {
        console.log(e);
      }
    });

    loaded = true;
  });

  afterUpdate(() => {
    if (loaded) {
      try {
        hljs.highlightAll();
      } catch (error) {
        console.log(error, 'error')
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
    <i use:tooltip={navTooltipStyleSmallMargin} title="Copy Code" on:click={copy}  class="fa fa-clipboard" aria-hidden="true" />
    {:else}
    <i use:tooltip={navTooltipStyleSmallMargin} title="Copied" on:mouseleave={() => hasCopiedCode = false} on:click={copy}  class="fa fa-clipboard" aria-hidden="true" />
    {/if}
    <i       
      use:tooltip={navTooltipStyleCodeSmallMarginBottom}
      on:click={zoomOut} 
      title="Zoom Out" 
      class="fa fa-search-minus float-end me-4"
      aria-hidden="true" />
    <i use:tooltip={navTooltipStyleSmallMargin} 
      on:click={zoomIn} title="Zoom In"  
      class="fa fa-search-plus float-end" 
      aria-hidden="true" />
  </div>
</div>
<pre style="font-size: {fontSize}px">
  <code class="{settings.language === 'Python' ? 'language-python' : 'language-arduino'}">{@html code}</code>
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
</style>
