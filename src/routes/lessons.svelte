<script context="module" lang="ts">
  import _ from "lodash";
  import { getLessons } from "../lessons/lesson.list";
  import type {  Lessons } from "../lessons/lesson.model";
  import config from '../env';
	export async function preload(page) {
    try {
    const lessonList = await getLessons(config.bucket_name);

    return { lessonList };

    } catch(e) {
      console.log('error', e);
      return {
        lessons: [],
        date: '2020-01-01'
      }
    }
	}
</script>
<script lang="ts">
  export let lessonList: Lessons;
  let lessons = _.chunk(lessonList.lessons, 3);
  import Lesson from "../components/electroblocks/lessons/LessonPreview.svelte";
  
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
