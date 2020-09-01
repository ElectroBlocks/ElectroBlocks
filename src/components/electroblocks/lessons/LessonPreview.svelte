<script lang="ts">
  import type { Lesson } from "../../../lessons/lesson.model";
  export let lesson: Lesson;
  let lessonMainImage = `/lessons/${lesson.authorFolderName}/${lesson.folderName}/main.${lesson.contentType}`;
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

<article data-lesson={lesson.id}>
  <img src={lessonMainImage} alt={lesson.title} />
  <h2>{lesson.title}</h2>
</article>
