<script>
    import { workspaceToXML } from '../core/blockly/helpers/workspace.helper';
    import codeStore from '../stores/code.store';
    import { saveAs } from 'file-saver';
    import { onDestroy } from 'svelte';

    let code;

    let unsubCodeStore = codeStore.subscribe(newCode => {
        code = newCode.code;
    })

    function downlaodCode() {
        const blob = new Blob([code], {type: "text/plain;charset=utf-8"});
        saveAs(blob, 'electroblocks_code.ino');
    }

    function downloadProject() {
        const blob = new Blob([workspaceToXML()], {type: "application/xml;charset=utf-8"});
        saveAs(blob, 'electroblocks_project.xml');
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
    button {
        float: none;
    }
    button#project {
        float: right;
    }
    button#code {
        float: left;
    }
    h1 {
        text-align: center;
        margin: 10px 0;
    }
</style>

<main class="container">
    <div class="row">
        <div class="column">
            <h1>Download Center</h1>
        </div>
    </div>
    <div class="row">
        <div class="column">
            <p>You can download the project file or the arduino code.</p>
        </div>
    </div>
    <div class="row">
        <div class="column">
            <button id="project" class="button button-primary" on:click={downloadProject}>Download Project</button>

        </div>
        <div class="column">
            <button id="code" class="button button-primary" on:click={downlaodCode}>Download Code</button>
        </div>
    </div>
</main>
