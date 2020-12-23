<script>
    import { workspaceToXML } from "../core/blockly/helpers/workspace.helper";
    import codeStore from "../stores/code.store";
    import { saveAs } from "file-saver";
    import { onDestroy } from "svelte";
    import { Button } from "sveltestrap/src";

    let code;

    let unsubCodeStore = codeStore.subscribe((newCode) => {
        code = newCode.code;
    });

    function downlaodCode() {
        const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "electroblocks_code.ino");
    }

    function downloadProject() {
        const blob = new Blob([workspaceToXML()], {
            type: "application/xml;charset=utf-8",
        });
        saveAs(blob, "electroblocks_project.xml");
    }

    onDestroy(() => {
        unsubCodeStore();
    });
</script>

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
            <Button id="download-code-btn" color="info" on:click={downlaodCode}>
                Download Code
            </Button>
        </div>
    </div>
</main>
<svelte:head>
    <title>Electroblocks - Download</title>
</svelte:head>
