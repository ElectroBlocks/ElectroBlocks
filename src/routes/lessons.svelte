<script lang="ts">
  import _ from "lodash";
  import LessonPreview from "../components/electroblocks/lessons/LessonPreview.svelte";
  import { FormGroup, Input, Label, Button } from "sveltestrap/src";

  import { getLessons } from "../lessons/lesson.list";
  import { onMount } from "svelte";
  import type { Lesson } from "../lessons/lesson.model";
  import { Categories } from "../lessons/lesson.model";
  let lessonList: Lesson<any>[] = [];
  let filteredLesson: Array<Array<Lesson<any>>> = [];
  let searchTerm = "";
  let categoryFilter = "All";
  $: if (searchTerm === "" && categoryFilter === "All") {
    filteredLesson = _.chunk(lessonList, 2);
  } else {
    filteredLesson = _.chunk(
      lessonList
        .filter(
          (l) => categoryFilter === "all" || l.category === categoryFilter
        )
        .filter((l) => {
          return (
            searchTerm === "" ||
            l.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }),
      2
    );
  }

  onMount(async () => {
    lessonList = await getLessons();
    filteredLesson = _.chunk(lessonList, 2);
    console.log(filteredLesson);
  });
</script>

<style>
  .no-padding-left {
    padding-left: 0;
  }
  .no-padding-right {
    padding-right: 0;
  }
</style>

<main>
  <section class="container">
    <div class="row">
      <div class="col-10 offset-1 no-padding-left">
        <h1>Lessons</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-7 offset-1 no-padding-left">
        <FormGroup>
          <Label for="search">Search</Label>
          <Input bind:value={searchTerm} type="text" name="text" id="search" />
        </FormGroup>
      </div>
      <div class="col-3 no-padding-right">
        <FormGroup>
          <Label for="Category">Category</Label>
          <Input
            bind:value={categoryFilter}
            type="select"
            name="select"
            id="Category">
            {#each Object.values(Categories) as cat}
              <option>{cat}</option>
            {/each}
            <option>All</option>
          </Input>
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
            title={lesson.title}
            description={lesson.description} />
        {/each}
      </section>
    {/each}
  </section>
</main>
<svelte:head>
  <title>Electroblocks - Lessons</title>
</svelte:head>
