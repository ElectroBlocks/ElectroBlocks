<script lang="ts">
  import { loadProjectFromUrl } from '../../../core/blockly/helpers/workspace.helper';

  import type { StarterLesson } from '../../../lessons/lessons';
  export let lesson: StarterLesson;

  async function getLesson() {
    await loadProjectFromUrl(lesson.projectUrl);
  }
</script>

<h2>{lesson.title}</h2>
<img on:click={getLesson} src={lesson.pictureUrl} alt={lesson.title} />

<style>
  img {
    width: 100%;
    display: 'block';
    cursor: pointer;
  }
</style>
