<script>
  import Lesson from "../../components/electroblocks/lessons/LessonPreview.svelte";
  import { getLessons } from "../../lessons/lesson.list";
  import _ from "lodash";
  const lessons = _.chunk(getLessons(), 3);
</script>

<style>
  :global(#right_panel) {
    overflow-y: scroll;
  }
  main {
    margin: 20px;
    min-height: 100vh;
    overflow-y: scroll;
  }
  section {
    display: flex;
  }
  h1 {
    font-size: 2em;
    text-align: center;
  }
</style>

<main>
  <h1>Lessons</h1>
  {#each lessons as lessonRow}
    <section>
      {#each lessonRow as lesson}
        <Lesson {lesson} />
      {/each}
    </section>
  {/each}
</main>
