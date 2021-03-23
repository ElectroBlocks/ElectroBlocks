<script>
  import { onMount } from "svelte";
  import codeStore from "../stores/code.store.ts";
  import "prismjs/themes/prism.css";
  import "prismjs/themes/prism-coy.css";
  import "prismjs/plugins/line-numbers/prism-line-numbers.css";
  import { afterUpdate } from "svelte";

  let code = "";
  let loaded = false;
  onMount(async () => {
    await import("prismjs");

    await import("prismjs/components");
    await import("prismjs/components/prism-c.js");
    await import("prismjs/plugins/line-numbers/prism-line-numbers.js");

    await import(
      "prismjs/plugins/highlight-keywords/prism-highlight-keywords.js"
    );
    codeStore.subscribe(async (codeInfo) => {
      code = Prism.highlight(codeInfo.code, Prism.languages.c, "c");
    });

    loaded = true;
  });

  afterUpdate(() => {
    if (loaded) {
      Prism.highlightAll();
    }
  });
</script>

<pre class="line-numbers language-c ">
  <code
    class="language-c"
  >
    {@html code}
  </code>
</pre>
<svelte:head>
  <title>ElectroBlocks - Code</title>
</svelte:head>

<style>
  pre {
    margin: 0;
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
