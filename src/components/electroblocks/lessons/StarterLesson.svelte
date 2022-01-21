<script lang="ts">
  import { loadProjectFromUrl } from '../../../core/blockly/helpers/workspace.helper';

  import type { StarterLesson } from '../../../lessons/lessons';
  import updateLoopblockStore from '../../../stores/update-loopblock.store';
  export let lesson: StarterLesson;

  async function getLesson() {
    await loadProjectFromUrl(lesson.projectUrl);
    updateLoopblockStore.update((n) => n + 1);
  }
</script>

<div class="lesson">
  <h2>{lesson.title}</h2>
  <img on:click={getLesson} src={lesson.pictureUrl} alt={lesson.title} />
  <a target="_blank" href={lesson.lessonUrl}>Support Page</a>
</div>

<style>
  img {
    width: 100%;
    display: 'block';
    cursor: pointer;
  }
  a {
    display: block;
    color: darkblue;
    text-decoration: underline;
    margin-top: 20px;
  }
  .lesson {
    border-bottom: solid gray 1px;
    padding: 2px;
    margin-bottom: 20px;
  }
</style>
