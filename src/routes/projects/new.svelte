<script>

    import { resetWorkspace } from "../../core/blockly/helpers/workspace.helper";
    function newFile() {
        resetWorkspace();
    }

</script>

<style>
    button#new-project {
        width: 100%;
        display: block;
        padding: 5px;
        border-radius: 0;
        font-size: 30px;
        border: 1px solid black;
        margin: 10px 0;
        outline: 0;
        cursor: pointer;
    }
</style>


<hr />
<button on:click={newFile} id="new-project">Create New Project</button>
