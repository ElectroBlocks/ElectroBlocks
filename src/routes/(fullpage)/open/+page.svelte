<script lang="ts">
  import { Table, Button, FormGroup, Input, Label } from '@sveltestrap/sveltestrap';

  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { lessons } from '../../../lessons/lessons';

  import { loadProject } from '../../../core/blockly/helpers/workspace.helper';
  import authStore from '../../../stores/auth.store';
  import {
    deleteProject,
    getFile,
    getProject,
    getProjects,
  } from '../../../firebase/db';
  import type { Project } from '../../../firebase/model';
  import type { Timestamp } from 'firebase/firestore';

  import { onConfirm, onErrorMessage } from '../../../help/alerts';
  import projectStore from '../../../stores/project.store';
  import _ from 'lodash';

  const unSubList: Function[] = [];
  let projectList: [Project, string][] = [];
  let searchList: [Project, string][] = [];
  let searchTerm = '';
  const toopTipConfig = {
    position: "bottom",
    align: "center",
    animation: "slide",
    theme: "lesson-tooltip",
  };
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

  async function openfile(filename) {
    await goto(`/?example_project=${filename}`);
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

<main class="container-fluid">
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
    <div class="row">
      <div class="col">
        <h2 class="p-0">Demo Projects!</h2>
      </div>
    </div>
    <div class="row">
      <div class="col text-center">
        <h3>Demo project difficulty level</h3>
      </div>
    </div>
    <div class="row legend">
      <div class="col">
        <h3 class="text-center w-100 mb-2">Easy</h3>
        <h5 class="text-center w-100">-</h5>
      </div>
      <div class="col">
        <h3 class="text-center w-100 mb-2">Medium</h3>
        <h5 class="text-center w-100">--</h5>
      </div>
      <div class="col">
        <h3 class="text-center w-100 mb-2">Hard</h3>
        <h5 class="text-center w-100">---</h5>
      </div>
    </div>
    
  {#each lessons as lessonContainer }
    <hr>
      <div class="row">
        <div class="col">
          <h3 class="p-0" >{lessonContainer.title}</h3>
        </div>
      </div>
      {#each _.chunk(lessonContainer.lessons, 3) as lessonRow }
        <div class="row g-2 g-lg-3">
          {#each lessonRow as lesson, index }
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div on:click={() => openfile(lesson.file)} class="col-4 lessonbox ">
            <h4 class="mt-4 title">{lesson.title}</h4>
            <img class="demo-image" src={lesson.image} alt={lesson.title}>
            <img src={lesson.levelImage} alt="difficulty-level" class="level">
          </div>
          {/each}
        </div>
      {/each}
  {/each}

      
</main>
<svelte:head>
  <title>ElectroBlocks - Open Projects</title>
</svelte:head>

<style>
  main.container-fluid {
    overflow: scroll !important;;
    height: 100vh;
  }
  img.demo-image {
    max-width: 100%;
    display: block;
    margin-top: 40px;
    margin-bottom: 10px;
      }
  
  .col {
    position: relative;
  }

  .level {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 25px;
  }
  .legend h5 {
    bottom: -10px;
  }

  h5 {
    position: absolute;
    bottom: 0px;
    margin:0;
    left: 0;
    font-size: 5rem;
    line-height: 20px;
  }
  .custom-file-upload {
    cursor: pointer;
  }
  .lessonbox {
    min-height: 170px;
    border: solid;
    cursor: pointer;
    position: relative;
  }
  
  input[type='file'] {
    display: none;
  }
  h4.title {
    font-size: 12px;
    position: absolute;
    width: calc(100% - 70px);
    margin-top: 0 !important;
    top: 10px;
    left: 10px;
  }

  .fa-trash {
    color: #a30d11;
    font-size: 30px;
    cursor: pointer;
    text-align: center;
    width: 100%;
  }

 
</style>
