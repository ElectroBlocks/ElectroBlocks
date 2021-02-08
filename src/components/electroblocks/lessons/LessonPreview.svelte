<script lang="ts">
  import { goto, stores } from "@sapper/app";
  const { page } = stores();
  export let image;
  export let title;
  export let description;
  export let lessonId;
  export let url = "/";
  $: src = image || "https://fakeimg.pl/320x300/";
  $: showTitle = title || "Enter Title";
  $: showDescription = description || "Enter Description";

  async function gotToLesson() {
    if ($page.query["projectid"]) {
      await goto(
        `${url}?lessonId=${lessonId}&projectid=${$page.query["projectid"]}`
      );
      return;
    }
    await goto(`${url}?lessonId=${lessonId}`);
  }
</script>

<div on:click={gotToLesson} class="col-5 lesson-preview">
  <h3 id="title">{showTitle}</h3>
  <img {src} alt={title} />
  <p>{showDescription} {showDescription.length > 145 ? '...' : ''}</p>
</div>

<style>
  h3 {
    text-align: center;
    font-size: 20px;
    padding: 3px;
    height: 60px;
  }

  img {
    max-height: 275px;
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }

  .lesson-preview {
    border: 1px rgb(233, 233, 247) solid;
    border-radius: 2px;
    max-height: 440px;
    padding: 5px;
    cursor: pointer;
  }

  p {
    margin-top: 10px;
    text-align: center;
  }
</style>
