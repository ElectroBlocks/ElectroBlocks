<script>
  export const ssr = false;
  import codeStore from "../../../stores/code.store";
  import hljs from 'highlight.js/lib/core';
  
  //Import hljs generator for python
  import arduinoLang from 'highlight.js/lib/languages/arduino';
  import pythonLang from 'highlight.js/lib/languages/python';
  
  import 'highlight.js/styles/arduino-light.css';
  import 'highlight.js/styles/a11y-light.css';

  import { tooltip } from "../../../helpers/tooltip.action";

  let fontSize = 14;
  let highlightedCode = '';
  hljs.registerLanguage("arduino", arduinoLang);
  hljs.registerLanguage("python", pythonLang);

  $: {
    try {
      highlightedCode = hljs.highlight($codeStore.cLang, { language:  "arduino" }).value;
    } catch(e) {
      console.log(e);
    }
  }


  function zoomIn() {
    fontSize += 2;
  }

  function zoomOut() {
    fontSize -= 2;
  }

  function copy() {
      // @ts-ignore
    navigator.clipboard.writeText($codeStore.cLang);
    alert("Copied Code");
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
    <i use:tooltip={navTooltipStyleSmallMargin} title="Copy Code" on:click={copy}  class="fa fa-clipboard" aria-hidden="true" />
    
    
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


<pre style="font-size: {fontSize}px;">
  <code class="hljs language-c">{@html highlightedCode}</code>
</pre>

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
