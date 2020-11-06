<script lang="ts">
  import { goto } from "@sapper/app";
import { onErrorMessage } from "../../../help/alerts";
  import type { LessonCompat } from "../../../lessons/lesson.model";
  export let lesson: LessonCompat;

  async function pickLesson(id) {
    try {
        await goto(`?lessonId=${id}`);
    } catch(e) {
      onErrorMessage("Please refresh your browser and try again", e);
    }
  }
</script>

<style>

  
  /** Doc
    https://jsfiddle.net/3ha1gw64/

   */
  article {
    cursor: pointer;
    /*
      1/3  - 3 columns per row
      10px - spacing between columns 
    */
    box-sizing: border-box;
    margin: 10px 10px 0 0;
    /* width: calc(1/3*100% - (1 - 1/3)*10px); */
  }
  

  /*
    align last row columns to the left
    3n - 3 columns per row
  */
  article:nth-child(3n) {
    margin-right: 0;
  }
  article::after {
    content: '';
    flex: auto;
  }
  /*
    remove top margin from first row
    -n+3 - 3 columns per row 
  */
  article:nth-child(-n+3) {
    margin-top: 0;
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
