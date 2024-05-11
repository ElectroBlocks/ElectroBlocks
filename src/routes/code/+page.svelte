<script>
  import { onMount } from "svelte";
  import codeStore from "../../stores/code.store";
  import hljs from 'highlight.js/lib/core';
  import arduinoLang from 'highlight.js/lib/languages/arduino';
  import 'highlight.js/styles/arduino-light.css';
  import 'highlight.js/styles/a11y-light.css';

  import { afterUpdate } from "svelte";

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
    height: 100vh;
  }
  code {
    margin-left: 10px;
    height: 100vh;
    overflow: scroll;
  }
</style>
