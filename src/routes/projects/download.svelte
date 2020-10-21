<script>
    import { workspaceToXML } from '../../core/blockly/helpers/workspace.helper';
    import codeStore from '../../stores/code.store';
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


<div class="row">
    <p>You can download the project file or the arduino code.</p>
</div>
<div class="row">
    <button class="btn" on:click={downloadProject}>Download Project</button>
    <button class="btn" on:click={downlaodCode}>Download Code</button>
</div>