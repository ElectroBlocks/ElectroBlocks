<script lang="ts">
    import authStore from '../../stores/auth.store';
    import projectStore from '../../stores/project.store';
    import Login from '../../components/auth/Login.svelte';
    import { addProject, saveProject } from '../../firebase/db';
    
    let projectName;
    let projectDescription;


    async function saveFile() {
        if (!$projectStore.projectId) {
            const [projectId, project] = await addProject({ name: projectName, 
                    description: projectDescription,
                    userId: $authStore.uid,
                    updated: null,
                    created: null
            })
            projectStore.set({ projectId, project });
            return;
        }
        const projectToSave = {...$projectStore.project, name: projectName, description: projectDescription};
        await saveProject(projectToSave, $projectStore.projectId);
        projectStore.set({ projectId: $projectStore.projectId, project: projectToSave });
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