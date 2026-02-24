<script>
  import { workspaceToXML } from "../../../core/blockly/helpers/workspace.helper";
  import codeStore from "../../../stores/code.store";
  import { onDestroy } from "svelte";
  import { Button } from "@sveltestrap/sveltestrap";
  import { saveDownloadFile } from "../../../core/blockly/helpers/file.helper";

  let cCode;
  let pythonCode;

  let unsubCodeStore = codeStore.subscribe((newCode) => {
    cCode = newCode.cLang;
    pythonCode = newCode.pythonLang;
  });

  function downloadCode(type) {
    let fileName ='electroblocks_' + new Date().getTime();
    const blob = new Blob([type == 'c++' ? cCode : pythonCode], { type: "text/plain;charset=utf-8" });
    saveDownloadFile(blob, fileName + (type == 'c++' ? ".ino"  : ".py"));
  }

  function downloadProject() {
    const blob = new Blob([workspaceToXML()], {
      type: "application/xml;charset=utf-8",
    });
    saveDownloadFile(blob, "electroblocks_project.xml");
  }



  onDestroy(() => {
    unsubCodeStore();
  });
</script>

<main class="container">
  <div class="row">
    <div class="col">
      <h1>Download Center</h1>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <p>You can download the project file or the arduino code.</p>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <Button color="primary" on:click={downloadProject}>
        Download Project
      </Button>
    </div>
    <div class="col">
      <Button id="download-code-btn" color="primary" on:click={() => downloadCode('c++')}>
        Download C++ Code
      </Button>
    </div>
    <div class="col">
      <Button id="download-code-btn" color="primary" on:click={() => downloadCode('python')}>
        Download Python Code
      </Button>
    </div>
  </div>
</main>
<svelte:head>
  <title>ElectroBlocks - Download</title>
</svelte:head>

<style>
  main {
    width: 90%;
    margin-left: 5%;
  }
  p {
    text-align: center;
  }

  :global(#download-code-btn) {
    float: left;
  }
  h1 {
    text-align: center;
    margin: 10px 0;
  }
</style>
