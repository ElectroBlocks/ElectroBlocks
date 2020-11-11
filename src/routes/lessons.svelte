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
  const [lesson1, lesson2] = lessonList.lessons;
  lesson2.title = 'Motion Sensor';
  const lesson3 = _.cloneDeep(lesson1);
  lesson3.title = 'Bluetooth'
  const lesson4 = _.cloneDeep(lesson1);
  lesson4.title = 'Touch Sensor'
  const lesson5 = _.cloneDeep(lesson1);
  lesson5.title = 'Soil Sensor'
  lessonList.lessons = [lesson1, lesson2, lesson3, lesson4, lesson5];
  let filteredLesson = lessonList.lessons;
  import Lesson from "../components/electroblocks/lessons/LessonPreview.svelte";
  let searchTerm = '';
  $: if (searchTerm === '') {
      filteredLesson = lessonList.lessons
  } else {
     filteredLesson = lessonList.lessons.filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }
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
  
  h1 {
    font-size: 2em;
    margin: 0 auto;
    width: 675px;
  }

  

  section {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin: 0 auto;
    width: 675px;
}

  .search-container {
      margin: 0 auto;
      width: 675px;
  }

  .search-container input {
    width: 675px !important;
  }

</style>

<main>
  <h1>Lessons</h1>
  <div class="search-container">
    <input class="form" placeholder="Search Lessons" bind:value={searchTerm} type="text"  id="lesson-search" />
  </div>
    <section>
        {#each filteredLesson as lesson}
              <Lesson {lesson} />
        {/each}
    </section>

</main>
<svelte:head>
  <title>Electroblocks - Lessons</title>
</svelte:head>