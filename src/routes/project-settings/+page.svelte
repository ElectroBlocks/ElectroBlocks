<script lang="ts">
  import { FormGroup, Input, Label, Button } from "@sveltestrap/sveltestrap";

  import authStore from "../../stores/auth.store";
  import projectStore from "../../stores/project.store";
  import Login from "../../components/auth/Login.svelte";
  import { addProject, saveProject } from "../../firebase/db";
  import { onDestroy } from "svelte";
  import FlashMessage from "../../components/electroblocks/ui/FlashMessage.svelte";
  import { wait } from "../../helpers/wait";
  import { onErrorMessage } from "../../help/alerts";
  import { workspaceToXML } from "../../core/blockly/helpers/workspace.helper";
  import codeStore from "../../stores/code.store";
  import { saveAs } from "file-saver";

  let showMessage = false;
  let projectName = "";
  let projectDescription = "";
  let canSave = true;

  const unSubProjectStore = projectStore.subscribe((projectInfo) => {
    if (projectInfo.project) {
      projectName = projectInfo.project.name;
      projectDescription = projectInfo.project.description;
    }
  });

  onDestroy(() => {
    if (unSubProjectStore) {
      unSubProjectStore();
    }
  });

  async function saveFile() {
    if (!canSave) return;

    canSave = false;
    try {
      if (!$projectStore.projectId) {
        const { projectId, project } = await addProject({
          name: projectName,
          description: projectDescription,
          userId: $authStore.uid,
          updated: null,
          created: null,
          canShare: false,
        });
        projectStore.set({ project: project, projectId });
        showMessage = true;
        wait(400);
        canSave = true;
        return;
      }
      const projectToSave = {
        ...$projectStore.project,
        name: projectName,
        description: projectDescription,
      };
      await saveProject(projectToSave, $projectStore.projectId);
      projectStore.set({
        projectId: $projectStore.projectId,
        project: projectToSave,
      });
      showMessage = true;
      canSave = true;
    } catch (e) {
      onErrorMessage("Please try again in 5 minutes", e);
      canSave = true;
    }
  }

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

<main class="container">
  {#if $authStore.isLoggedIn}
    <div class="row">
      <div class="col">
        <h2>Project Settings</h2>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <FormGroup>
          <Label for="project-name">Name</Label>
          <Input
            bind:value={projectName}
            type="text"
            name="text"
            id="project-name"
          />
        </FormGroup>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <FormGroup>
          <Label for="project-description">Description</Label>
          <Input
            bind:value={projectDescription}
            type="textarea"
            name="text"
            id="project-description"
          />
        </FormGroup>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <Button class="w-100" color="success" on:click={saveFile}>Save</Button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <FlashMessage bind:show={showMessage} message="Saved Project." />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <Button class="w-100" color="info" on:click={downloadProject}>
          Download Project
        </Button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <Button class="w-100" color="info" on:click={downlaodCode}>
          Download Code
        </Button>
      </div>
    </div>
  {:else}
    <div class="row">
      <div class="col">
        <p>
          To Save project you must be logged in. If you don't want to login you
          can go to the
          <a href="/projects/download">download page</a>
          to download the code or project onto your computer.
        </p>
        <Login />
      </div>
    </div>
  {/if}
</main>

<svelte:head>
  <title>ElectroBlocks - Project Settings</title>
</svelte:head>

<style>
  main {
    margin: 10px auto;
  }
  .row {
    margin-bottom: 10px;
  }
</style>
