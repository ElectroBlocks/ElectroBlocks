<script lang="ts">
  import type { StarterLesson } from '../../../lessons/lessons';
  export let lesson: StarterLesson;

  function getLesson() {
    alert('Get Lesson');
  }
</script>

<h2>{lesson.title}</h2>
<img on:click={getLesson} src={lesson.pictureUrl} alt={lesson.title} />
