<script lang="ts">
  import VerticalComponentContainer from "../components/electroblocks/VerticalComponentContainer.svelte";
  import Simulator from "../components/electroblocks/home/Simulator.svelte";
  import Step from "../components/electroblocks/home/Steps.svelte";
  import { getLesson } from "../lessons/lesson.list";
  import { onMount } from "svelte";

  import { stores } from "@sapper/app";
import { onErrorMessage } from "../help/alerts";

  const { page, session } = stores();
  let showLesson = false; 


  onMount(async () => {
    console.log($page);
    if ($page.query["lessonId"]) {
          try {
            showLesson = true;
            const lesson =  await getLesson($session.bucket_name, $page.query["lessonId"]);
            const event = new Event('lesson-change');
            (event as any).detial = lesson;
            console.log(lesson);
            document.dispatchEvent(event);
          } catch(e) {
            onErrorMessage("Error loading the lesson", e)
        }
    }
    

    document.addEventListener('lesson-close', () => {
      showLesson = false;
    })
  })

  
 
</script>

<style>
  .slot-wrapper {
    height: 100%;
    width: 100%;
  }
</style>
{#if showLesson}
  <ng-lessons left="500" top="150" />
{/if}
<VerticalComponentContainer>
  <div class="slot-wrapper" slot="top">
    <Simulator />
  </div>
  <div class="slot-wrapper" slot="bottom">
    <Step />
  </div>
</VerticalComponentContainer>
<svelte:head>
  <title>Electroblocks</title>
</svelte:head>