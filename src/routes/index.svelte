<script lang="ts">
  import VerticalComponentContainer from "../components/electroblocks/VerticalComponentContainer.svelte";
  import Simulator from "../components/electroblocks/home/Simulator.svelte";
  import Step from "../components/electroblocks/home/Steps.svelte";
  import { onMount } from "svelte";

  import { stores } from "@sapper/app";
  import { onErrorMessage } from "../help/alerts";
  import InAppTutorialFeter from "../lessons/InAppTutorialFetcher";
  import authStore from "../stores/auth.store";
  import config from "../env";

  const { page } = stores();

  onMount(async () => {
    // move this to layout view
    const inAppTutorialFetcher = new InAppTutorialFeter(config.site);
    if ($page.query["lessonId"]) {
      try {
        await inAppTutorialFetcher.open(500, 150, $page.query["lessonId"]);
      } catch (e) {
        onErrorMessage("Error loading the lesson", e);
      }
    }

    authStore.subscribe(async (info) => {
      if (
        info.firebaseControlled &&
        !info.isLoggedIn &&
        !sessionStorage.getItem("showed_lesson") &&
        !$page.query["lessonId"]
      ) {
        sessionStorage.setItem("showed_lesson", "yes");
        await inAppTutorialFetcher.open(500, 150, config.starterLessonId);
      }
    });
  });
</script>

<VerticalComponentContainer>
  <div class="slot-wrapper" slot="top">
    <Simulator />
  </div>
  <div class="slot-wrapper" slot="bottom">
    <Step />
  </div>
</VerticalComponentContainer>
<svelte:head>
  <title>ElectroBlocks</title>
</svelte:head>

<style>
  .slot-wrapper {
    height: 100%;
    width: 100%;
  }
</style>
