<script lang="ts">
  import { FormGroup, Input } from 'sveltestrap/src';
  import { starterLessons, videoLessons } from '../../../lessons/lessons';
  import StarterLesson from '../lessons/StarterLesson.svelte';
  import VideoLesson from '../lessons/VideoLesson.svelte';
  import showLessonStore from '../../../stores/showLessons.store';
  import { resizeStore } from '../../../stores/resize.store';
  import { tick } from 'svelte';
  let category = 'video';

  let videoLessonFiltered = videoLessons;
  let starterLessonsFiltered = starterLessons;

  async function close() {
    showLessonStore.set(false);
    await tick();
    await tick();
    resizeStore.mainWindow();
  }
</script>

<div class="lessons-container">
  <div on:click={close} id="close">X</div>
  <h2>Lessons</h2>
  <FormGroup>
    <Input type="select" bind:value={category} name="select" id="Category">
      <option value="video">Videos</option>
      <option value="starter">Starters</option>
    </Input>
  </FormGroup>
  {#if category == 'video'}
    {#each videoLessonFiltered as videoLesson}
      <VideoLesson lesson={videoLesson} />
    {/each}
  {/if}

  {#if category == 'starter'}
    {#each starterLessonsFiltered as starterLesson}
      <StarterLesson lesson={starterLesson} />
    {/each}
  {/if}
</div>

<style>
  .lessons-container {
    padding: 15px;
    position: relative;
    margin-bottom: 1000px;
  }

  #close {
    width: 20px;
    height: 20px;
    background-color: #aa0000;
    color: white;
    text-align: center;
    right: 0;
    top: 0;
    position: absolute;
    cursor: pointer;
    user-select: none;
  }
</style>
