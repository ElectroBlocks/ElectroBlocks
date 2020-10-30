<script lang="ts">
    import { stores } from "@sapper/app";
    import { onMount } from "svelte";
import { loadProject } from "../../../core/blockly/helpers/workspace.helper";
import { getFile, getProject } from "../../../firebase/db";
    import authStore from '../../../stores/auth.store';
    const { page } = stores();

    import projectStore from '../../../stores/project.store';

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
            return;
        }

        if (!$authStore.isLoggedIn) {
            return;
        }

        const project = await getProject($page.params['projectid']);
        const file = await getFile($page.params['projectid'], $authStore.uid);
        loadProject(file);
        projectStore.set({ project, projectId: $page.params['projectid'] });
        alert('here');
    })
</script>

<slot></slot>