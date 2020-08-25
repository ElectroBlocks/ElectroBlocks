<script>
  import { goto } from "@sapper/app";

  export let title;
  export let lessonName;
  export let imgSrc;

  async function goToLesson(e) {
    const lesson = e.target.closest("article").getAttribute("data-lesson");
    console.log(lesson, "lesson");
    if (!lesson) {
      return;
    }

    await goto(`/electroblocks?lesson=${lesson}`);
  }
</script>

<style>
  article {
    margin-bottom: 10px;
    flex: 1;
    margin: 20px;
    cursor: pointer;
  }
  article img {
    width: 100%;
  }
  article h2 {
    border: solid gray 1px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background-color: white;
    text-align: center;
    margin-top: -8px;
    padding: 10px;
  }
</style>

<article data-lesson={lessonName} on:click={goToLesson}>
  <img src={imgSrc} alt={title} />
  <h2>{title}</h2>
</article>
