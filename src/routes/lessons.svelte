<script lang="ts">
  import _ from "lodash";
  import LessonPreview from "../components/electroblocks/lessons/LessonPreview.svelte";
  import { FormGroup, Input, Label, Button } from "sveltestrap/src";

  import InAppTutorialFeter from "../lessons/InAppTutorialFetcher";
  import { onMount } from "svelte";
  import type { Lesson } from "../lessons/lesson.model";

  let lessonList: Lesson<any>[] = [];
  let filteredLesson: Array<Array<Lesson<any>>> = [];
  let searchTerm = "";
  let tutFetcher: InAppTutorialFeter;
  let pageName = "All";

  $: if (searchTerm === "") {
    filteredLesson = _.chunk(
      lessonList.filter((l) => {
        return (
          searchTerm === "" ||
          l.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }),
      2
    );
  }

  async function changePage(e) {
    searchTerm = "";
    const pageName = e.target.value;
    lessonList = await tutFetcher.getLessonsByPage(pageName);

    filteredLesson = _.chunk(lessonList, 2);
    console.log(pageName, lessonList, "changepage");
  }

  onMount(async () => {
    tutFetcher = new InAppTutorialFeter("electroblocks-org");
    lessonList = await tutFetcher.getLessonsByPage("All");
    console.log(lessonList, "lessonList");
    filteredLesson = _.chunk(lessonList, 2);
  });
</script>

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
            on:change={changePage}
            bind:value={pageName}
            type="select"
            name="select"
            id="Category"
          >
            <option>All</option>
            <option>Lessons</option>
            <option>How Tos</option>
          </Input>
        </FormGroup>
      </div>
    </div>
    {#each filteredLesson as lessons}
      <section class="row mt-5">
        <div class="col-1" />
        {#each lessons as lesson}
          <LessonPreview
            url={lesson.url}
            lessonId={lesson.id}
            image={lesson.mainPicture}
            title={lesson.title}
            description={lesson.description}
          />
        {/each}
      </section>
    {/each}
  </section>
</main>
<svelte:head>
  <title>Electroblocks - Lessons</title>
</svelte:head>

<style>
  .no-padding-left {
    padding-left: 0;
  }
  .no-padding-right {
    padding-right: 0;
  }
</style>
