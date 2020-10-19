<script lang="ts">
  import { goto } from "@sapper/app";
  import type { LessonCompat } from "../../../lessons/lesson.model";
  export let lesson: LessonCompat;

  async function pickLesson(id) {
    await goto(`?lessonId=${id}`);
  }
</script>

<style>
  article {
    margin-bottom: 10px;
    width: 200px;
    margin: 20px;
    cursor: pointer;
  }
  article img {
    border: solid gray 1px;
    width: 200px;
    height: 200px;
    box-sizing: border-box;
  }
  article h2 {
    border: solid gray 1px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background-color: white;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
    width: 200px;
    margin-top: -10px;
  }
</style>

<article on:click={() => pickLesson(lesson.id)} data-id={lesson.id}>
  <img src={lesson.mainPicture} alt={lesson.title} />
  <h2>{lesson.title}</h2>
</article>
