<script lang="ts">
  import { Table, Button, FormGroup, Input, Label } from '@sveltestrap/sveltestrap';

  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';;

  import { loadProject } from '../../core/blockly/helpers/workspace.helper';
  import authStore from '../../stores/auth.store';
  import {
    deleteProject,
    getFile,
    getProject,
    getProjects,
  } from '../../firebase/db';
  import type { Project } from '../../firebase/model';
  import type { Timestamp } from 'firebase/firestore';

  import { onConfirm, onErrorMessage } from '../../help/alerts';
  import projectStore from '../../stores/project.store';

  const unSubList: Function[] = [];
  let projectList: [Project, string][] = [];
  let searchList: [Project, string][] = [];
  let searchTerm = '';
  $: filterSearch(searchTerm);

  function filterSearch(term: string) {
    if (term === '') {
      searchList = [...projectList];
      return;
    }
    searchList = searchList.filter(([p, id]) =>
      p.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  async function changeProject(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    if (
      !(await onConfirm(
        `Do you want to load ${file.name}, this will erase everything that you have done.`
      ))
    ) {
      return;
    }

    const reader = new FileReader();

    reader.onload = function (evt) {
      if (evt.target.readyState != 2) return;
      if (evt.target.error) {
        onErrorMessage('Please upload a valid electroblock file.', e);
        return;
      }

      projectStore.set({ project: null, projectId: null });

      loadProject(evt.target.result as string);
    };

    reader.readAsText(file);
  }

  onMount(() => {
    const unSubAuth = authStore.subscribe(async (auth) => {
      if (auth.isLoggedIn) {
        await updateProjectList();
        return;
      }
      projectList = [];
    });
    unSubList.push(unSubAuth);
  });

  async function updateProjectList() {
    try {
      projectList = await getProjects($authStore.uid);
      projectList = [...projectList];
      searchList = [...projectList];
    } catch (e) {
      onErrorMessage('Please refresh the page and try again.', e);
    }
  }

  onDestroy(() => {
    unSubList.forEach((s) => s());
  });

  function formatDate(timestamp: Timestamp | Date) {
    if (timestamp instanceof Date) {
      return timestamp.toDateString();
    }

    const date = new Date(timestamp.seconds * 1000);

    return date.toDateString();
  }

  async function onDeleteProject(projectId: string) {
    if (!(await onConfirm('Are you want to delete this project?'))) {
      return;
    }
    try {
      await deleteProject(projectId, $authStore.uid);
      await updateProjectList();
    } catch (e) {
      onErrorMessage('Please try agian in 5 minutes.', e);
    }
  }

  async function openProject(projectId) {
    const project = await getProject(projectId);
    const file = await getFile(projectId, $authStore.uid);
    loadProject(file);
    projectStore.set({ project, projectId });
    await goto(`/?projectid=${projectId}`);
  }
</script>

<main>
  <h2>Projects</h2>
  <hr />
  <label for="file-upload" class="form custom-file-upload">
    <i class="fa fa-cloud-upload" />
    Open a project from your computer
  </label>
  <input on:change={changeProject} id="file-upload" type="file" />
  <hr />
    {#if projectList.length > 0 && $authStore.isLoggedIn}
      <h3>Your Projects</h3>
      <FormGroup>
        <Label for="search">Search</Label>
        <Input bind:value={searchTerm} type="text" id="search" />
      </FormGroup>

      <Table hover bordered>
        <thead>
          <tr>
            <th>Name</th>
            <th>Modified</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {#each searchList as project}
            <tr>
              <td>{project[0].name}</td>
              <td>{formatDate(project[0].updated)}</td>
              <td>
                <Button
                  color="info"
                  class="w-100"
                  on:click={() => openProject(project[1])}
                >
                  Open
                </Button>
              </td>
              <td>
                <i
                  on:click={() => onDeleteProject(project[1])}
                  class="fa fa-trash"
                />
              </td>
            </tr>
          {/each}
        </tbody>
      </Table>
  {/if}
  <h3>Example Projects</h3>
  <section class="container">
    <div class="row">
      <div data-project="snake.xml" class="col">
        <img src="/example-projects/snake.gif" alt="snake projects">
        <h4 class="text-center mt-4">Snake Pattern</h4>
        <p class="text-center">A snake LED Light Pattern.</p> 
      </div>
      <div data-project="rainbow.xml" class="col ms-3">
          <img src="/example-projects/rainbow.gif" alt="rainbow lights">
          <h4 class="text-center mt-4">Rainbow Lights</h4>
          <p class="text-center">Create your own rainbow light pattern.</p> 
      </div>
    </div>
  </section>
</main>
<svelte:head>
  <title>ElectroBlocks - Open Projects</title>
</svelte:head>

<style>
  img {
    width: 100%;
    display: block;
    margin-top: 30px;
  }
  h4 {
    text-align: center;
    
  }
  .custom-file-upload {
    cursor: pointer;
  }
  .col {
    height: 300px;
    border: solid;
    cursor: pointer;
  }
  main {
    width: 90%;
    margin: 10px auto;
  }
  input[type='file'] {
    display: none;
  }

  .fa-trash {
    color: #a30d11;
    font-size: 30px;
    cursor: pointer;
    text-align: center;
    width: 100%;
  }
</style>
