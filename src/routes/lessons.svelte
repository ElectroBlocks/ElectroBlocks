<script context="module" lang="ts">
  import _ from "lodash";
  import { getLessons } from "../lessons/lesson.list";
  import type { Lessons } from "../lessons/lesson.model";
  import LessonPreview from "../components/electroblocks/lessons/LessonPreview.svelte";
  import { FormGroup, Input, Label, Button } from "sveltestrap/src";

  import config from "../env";
  export async function preload(page) {
    try {
      const lessonList = await getLessons(config.bucket_name);

      return { lessonList };
    } catch (e) {
      console.log("error", e);
      return {
        lessons: [],
        date: "2020-01-01",
      };
    }
  }
</script>

<script lang="ts">
  export let lessonList: Lessons;
  const [lesson1, lesson2] = lessonList.lessons;
  lesson2.title = "Motion Sensor";
  const lesson3 = _.cloneDeep(lesson1);
  lesson3.title = "Bluetooth";
  const lesson4 = _.cloneDeep(lesson1);
  lesson4.title = "Touch Sensor";
  const lesson5 = _.cloneDeep(lesson1);
  lesson5.title = "Soil Sensor";
  lessonList.lessons = [lesson1, lesson2, lesson3, lesson4, lesson5];
  let filteredLesson = _.chunk(lessonList.lessons, 2);
  let searchTerm = "";
  $: if (searchTerm === "") {
    filteredLesson = _.chunk(lessonList.lessons, 2);
  } else {
    filteredLesson = _.chunk(
      lessonList.lessons.filter((l) =>
        l.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
      2
    );
  }
</script>

<style>
</style>

<main>
  <section class="container">
    <div class="row">
      <div class="col-10 offset-1">
        <h1>Lessons</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-10 offset-1">
        <FormGroup>
          <Label for="search">Search</Label>
          <Input bind:value={searchTerm} type="text" name="text" id="search" />
        </FormGroup>
      </div>
    </div>
    {#each filteredLesson as lessons}
      <section class="row mt-5">
        <div class="col-1" />
        {#each lessons as lesson}
          <LessonPreview
            lessonId={lesson.id}
            image={lesson.mainPicture}
            title={lesson.title} />
        {/each}
      </section>
    {/each}
  </section>
</main>
<svelte:head>
  <title>Electroblocks - Lessons</title>
</svelte:head>
