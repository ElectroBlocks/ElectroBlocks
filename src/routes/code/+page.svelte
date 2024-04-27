<script>
  import { onMount } from "svelte";
  import codeStore from "../../stores/code.store";
  import hljs from 'highlight.js/lib/core';
  import arduinoLang from 'highlight.js/lib/languages/arduino';
  import 'highlight.js/styles/arduino-light.css';
  import 'highlight.js/styles/a11y-light.css';

  import { afterUpdate } from "svelte";
  export const ssr = false;

  let code = "";
  let loaded = false;
  onMount(async () => {
    hljs.registerLanguage('arduino', arduinoLang);
    codeStore.subscribe(async (codeInfo) => {
      try
      {
        // @ts-ignore
        code =  hljs.highlight(codeInfo.code,{ language: 'arduino' }).value;

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
</script>

<pre>
  <code class="language-arduino">{@html code}</code>
</pre>
<svelte:head>
  <title>ElectroBlocks - Code</title>
</svelte:head>

<style>
  pre {
    margin: 0;
    padding: 0;
    min-height: 100%;
    min-width: 100%;
    border-left: none;
    margin-bottom: 15px;
  }
  code {
    height: 100% !important;
    position: absolute !important;
    width: 100% !important;
    overflow: scroll !important;
  }
</style>
