<script>
  import { onMount, afterUpdate } from "svelte";
  import codeStore from "../../../stores/code.store";

  import hljs from 'highlight.js/lib/core';
  import arduinoLang from 'highlight.js/lib/languages/arduino';
  import 'highlight.js/styles/arduino-light.css';
  import 'highlight.js/styles/a11y-light.css';

  import { tooltip } from "@svelte-plugins/tooltips";
  import { get } from "svelte/store";

  let code = "";
  let loaded = false;
  let fontSize = 14;
  let hasCopiedCode = false;
  let hiddenCategories = [];

  onMount(() => {
    hljs.registerLanguage('arduino', arduinoLang);
    codeStore.subscribe((codeInfo) => {
      try {
        code = hljs.highlight(codeInfo.code, { language: 'arduino' }).value;
        hiddenCategories = codeInfo.hiddenCategories || [];
        console.log("Hidden Categories Updated:", hiddenCategories);
      } catch (e) {
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
</script>

<div class="row">
  <div class="col">
    {#if !hasCopiedCode}
      <i use:tooltip title="Copy Code" on:click={copy} class="fa fa-clipboard" aria-hidden="true" />
    {:else}
      <i use:tooltip title="Copied" on:mouseleave={() => hasCopiedCode = false} on:click={copy} class="fa fa-clipboard" aria-hidden="true" />
    {/if}
    <i use:tooltip on:click={zoomOut} title="Zoom Out" class="fa fa-search-minus float-end me-4" aria-hidden="true" />
    <i use:tooltip on:click={zoomIn} title="Zoom In" class="fa fa-search-plus float-end" aria-hidden="true" />
  </div>
</div>

<pre style="font-size: {fontSize}px">
  <code class="language-arduino">{@html code}</code>
</pre>

<svelte:head>
  <title>ElectroBlocks - Code</title>
</svelte:head>
