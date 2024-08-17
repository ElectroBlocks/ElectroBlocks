<script lang="ts">
  import { projects } from '../project/projects';
  import { loadProject } from '../../core/blockly/helpers/workspace.helper';
  import { onErrorMessage } from '../../help/alerts';
  import projectStore from '../../stores/project.store';
  import { goto } from '$app/navigation';

  async function loadDemo(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch the demo project.');
      }
      const xmlContent = await response.text();
      
      projectStore.set({ project: null, projectId: null });
      loadProject(xmlContent);
      await goto("/");
    } catch (e) {
      onErrorMessage('Error loading the demo project. Please try again.', e);
    }
  }
</script>

<style>
  .projects-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }
  .project-item {
    cursor: pointer;
    text-align: center;
    margin-bottom: 20px;
  }
  .project-item img {
    width: 150px;
    height: 150px;
    object-fit: cover;
  }

</style>

<main>
  <h2>Starter Projects</h2>
  <div class="projects-container">
    {#each projects as project}
      <div class="project-item" on:click={() => loadDemo(project.demoUrl)}>
        <img src={project.imageUrl} alt={project.name} />
        <p>{project.name}</p>
      </div>
    {/each}
  </div>
</main>

<svelte:head>
  <title>ElectroBlocks - Starter Projects</title>
</svelte:head>
