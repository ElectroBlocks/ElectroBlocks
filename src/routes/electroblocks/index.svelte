<script>
  import { stores, goto } from "@sapper/app";

  import VerticalComponentContainer from "../../components/electroblocks/VerticalComponentContainer.svelte";
  import Simulator from "../../components/electroblocks/home/Simulator.svelte";
  import Step from "../../components/electroblocks/home/Steps.svelte";
  import { getLesson } from "../../lessons/lesson.list";
  import Lesson from "../../components/electroblocks/lessons/Lesson.svelte";
  let lesson;
  const { page } = stores();
  page.subscribe(({ path, params, query }) => {
    if (query["lessonId"]) {
      lesson = getLesson(query["lessonId"]);
    }
  });

  function closeLesson() {
    lesson = undefined;
  }

  async function goToLessons() {
    await goto("/electroblocks/lessons");
  }
</script>

<style>
  .slot-wrapper {
    height: 100%;
    width: 100%;
  }
</style>

{#if lesson}
  <Lesson on:close={closeLesson} on:lessons={goToLessons} {lesson} />
{/if}

<VerticalComponentContainer>
  <div class="slot-wrapper" slot="top">
    <Simulator />
  </div>
  <div class="slot-wrapper" slot="bottom">
    <Step />
  </div>
</VerticalComponentContainer>
