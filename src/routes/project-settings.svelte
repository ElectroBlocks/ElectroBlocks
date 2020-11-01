<script lang="ts">
    import authStore from '../stores/auth.store';
    import projectStore from '../stores/project.store';
    import Login from '../components/auth/Login.svelte';
    import { addProject, saveProject } from '../firebase/db';
    import { onDestroy } from 'svelte';
    import FlashMessage from '../components/electroblocks/ui/FlashMessage.svelte';
    import { wait } from '../helpers/wait';
    import { goto } from '@sapper/app';
    
    let showMessage = false;
    let projectName = '';
    let projectDescription = '';
    let canSave = true;

    const unSubProjectStore = projectStore.subscribe(projectInfo => {
        if (projectInfo.project) {
            projectName = projectInfo.project.name;
            projectDescription = projectInfo.project.description;
        }
    });

    onDestroy(() => {
        if (unSubProjectStore) {
            unSubProjectStore();
        }
    })


    async function saveFile() {
        if (!canSave) return;

        canSave = false;
        try {
            if (!$projectStore.projectId) {
                const [projectId, project] = await addProject({ name: projectName, 
                        description: projectDescription,
                        userId: $authStore.uid,
                        updated: null,
                        created: null,
                        canShare: false
                })
                projectStore.set({ projectId, project });
                showMessage = true;
                wait(400);
                await goto(`/project/${$projectStore.projectId}/project-settings`);
                canSave  = true;
                return;
            }
            const projectToSave = {...$projectStore.project, name: projectName, description: projectDescription};
            await saveProject(projectToSave, $projectStore.projectId);
            projectStore.set({ projectId: $projectStore.projectId, project: projectToSave });
            showMessage = true;
            canSave = true;
        } catch(e) {
            alert('error');
            console.log(e);
            canSave = true;
        }
    }
</script>

<style>
    button {
        float: right;
        display: block;
        margin-top: 10px;
    }
    main {
        width: 90%;
        margin: 10px auto;
    }
    #btn-container {
        height: 30px;
        width: 100%;
    }
</style>

<main>
{#if $authStore.isLoggedIn}
        <h2>Project Settings</h2>
        <label class="form" for="project-name">Name</label>
        <input class="form" bind:value={projectName} id="project-name" type="text">
        <label class="form" for="project-description">Description</label>
        <textarea class="form" bind:value={projectDescription}  id="project-description" ></textarea>
       
        <div id="btn-container">
            <button disabled={!canSave} on:click={saveFile} class="form">Save</button>
        </div> 
        <FlashMessage bind:show={showMessage} message="Saved Project." />

    {:else}
    <p>To Save project you must be logged in.  If you don't want to login you can go to the <a href="/projects/download">download page</a> to download the code or project onto your computer.</p>
    <Login />
{/if}

</main>

<svelte:head>
  <title>Electroblocks - Project Settings</title>
</svelte:head>
