<script lang="ts">
    import { stores } from "@sapper/app";
    import { fade } from 'svelte/transition';
    import { onMount } from "svelte";
    import { loadProject } from "../../../core/blockly/helpers/workspace.helper";
    import { getFile, getProject } from "../../../firebase/db";
    import { isPathOnHomePage } from "../../../helpers/is-path-on-homepage";
    import authStore from '../../../stores/auth.store';
    import { goto } from '@sapper/app';
    const { page } = stores();

    import projectStore from '../../../stores/project.store';
    import { arduinoLoopBlockShowLoopForeverText, arduinoLoopBlockShowNumberOfTimesThroughLoop } from "../../../core/blockly/helpers/arduino_loop_block.helper";
import { onErrorMessage } from "../../../help/alerts";
    let loadingProject = true;

    if ($page.params['projectid']) {
        ($page.params['projectid']);
    }

    function wait(msTime) {
        return new Promise((resolve) => setTimeout(resolve, msTime));
    }

    onMount(async () => {
        
        while(!$authStore.firebaseControlled) {
            await wait(5);
        }
    
        if ($projectStore.projectId === $page.params['projectid']) {
            loadingProject = false;
            return;
        }

        if (!$authStore.isLoggedIn) {
            loadingProject = false;
            onErrorMessage("You must be logged in to view your projects.", {});
            await goto("/login")
            return;
        }

        const project = await getProject($page.params['projectid']);
        const file = await getFile($page.params['projectid'], $authStore.uid);
        loadProject(file);
        projectStore.set({ project, projectId: $page.params['projectid'] });
        if (isPathOnHomePage($page.path)) {
            arduinoLoopBlockShowNumberOfTimesThroughLoop();
        } else {
            arduinoLoopBlockShowLoopForeverText()
        }
        loadingProject = false;
    })
</script>

<style>
    #loading {
    position: fixed;
    left: 0;
    top: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    background-color: rgba(0,0,0, .8);
  }
  #loading h1 {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: 300px;
    color: wheat;
    pointer-events: none;
  }
  #loading img {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: 400px;
    pointer-events: none;
  }
</style>

{#if loadingProject}
  <div id="loading" transition:fade  >
    <h1>Loading Project...</h1>
    <img src="/logo.png" alt="electroblock logo">
  </div>
{/if}
<slot></slot>