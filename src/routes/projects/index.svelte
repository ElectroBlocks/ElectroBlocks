<script lang="ts">
    import authStore from '../../stores/auth.store';
    import Login from '../../components/auth/Login.svelte';
    import { fbSaveFile } from '../../firebase/db';
    let projectName;
    let projectDescription;

    async function saveFile() {
        await fbSaveFile({ name: projectName, description: projectDescription, id: null, created: null, updated: null }, $authStore.uid);
    }
</script>

<style>
    button {
        float: right;
    }
    
</style>

{#if $authStore.isLoggedIn}
        
        <div class="row">
            <label for="project-name">Name</label>
            <input bind:value={projectName} id="project-name" type="text">
        </div>
        <div class="row">
            <label for="project-description">Description</label>
            <textarea bind:value={projectDescription}  id="project-description" cols="30" rows="10"></textarea>
        </div>
            <div class="row">
        <button on:click={saveFile} class="btn">Save</button>
    </div>
    {:else}
    <p>To Save project you must be logged in.  If you don't want to login you can go to the <a href="/projects/download">download page</a> to download the code or project onto your computer.</p>
    <Login />
{/if}