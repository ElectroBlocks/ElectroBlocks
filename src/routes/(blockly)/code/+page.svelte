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

  // Importing settings store
  import settingsStore from "../../../stores/settings.store";
  import { SUPPORTED_LANGUAGES } from "../../../core/microcontroller/microcontroller";
  import { FormGroup, Input, Label } from "@sveltestrap/sveltestrap";

  let code = "";
  let loaded = false;
  let fontSize = 14;
  let hasCopiedCode = false;
  let c_code = '';
  let python_code = ''

  onMount(async () => {
    hljs.registerLanguage('arduino', arduinoLang);
    hljs.registerLanguage('python', pythonLang);
    codeStore.subscribe(async (codeInfo) => {
      try {
          python_code = hljs.highlight(codeInfo.pythonLang, { language: 'python'}).value;
          // @ts-ignore
          c_code =  hljs.highlight(codeInfo.cLang, { language: 'arduino' }).value;
      }
      catch(e)
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
    if ($settingsStore.language === SUPPORTED_LANGUAGES.PYTHON) {
      navigator.clipboard.writeText($codeStore.pythonLang);
    } else {
      // @ts-ignore
      navigator.clipboard.writeText($codeStore.cLang);
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
<div id="controls"  >

<div class="row ps-3 pe-3">
  <div class="col">
    <FormGroup>
      <Label for="lang-select">Selected Language</Label>
      <Input
        bind:value={$settingsStore.language}
        type="select"
        id="lang-select"
      >
        <option value="Python">Python</option>
        <option value="C">C</option>
      </Input>
    </FormGroup>
  </div>
</div>

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
</div>

{#if $settingsStore.language == 'Python'}
<pre style="font-size: {fontSize}px;">
  <code  class="language-python">{@html python_code}</code>
</pre>
{:else}
<pre style="font-size: {fontSize}px;">
  <code class="language-arduino">{@html c_code}</code>
</pre>
{/if}

<svelte:head>
  <title>ElectroBlocks - Code</title>
</svelte:head>

<style>
  pre {
    margin: 0;
    padding: 0;
  }
  code {
    margin: 0;
    padding: 0;
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
