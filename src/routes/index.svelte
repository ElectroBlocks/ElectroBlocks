<script lang="ts">
  import VerticalComponentContainer from "../components/electroblocks/VerticalComponentContainer.svelte";
  import Simulator from "../components/electroblocks/home/Simulator.svelte";
  import Step from "../components/electroblocks/home/Steps.svelte";
  import { onMount } from "svelte";

  import { stores } from "@sapper/app";
  import { onErrorMessage } from "../help/alerts";
  import config from "../env";
  import InAppTutorialFeter from "../lessons/InAppTutorialFetcher";

  const { page } = stores();

  onMount(async () => {
    console.log($page);
    const inAppTutorialFetcher = new InAppTutorialFeter("electroblocks-org");
    if ($page.query["lessonId"]) {
      try {
        await inAppTutorialFetcher.open(500, 150, $page.query["lessonId"]);
      } catch (e) {
        onErrorMessage("Error loading the lesson", e);
      }
    }
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
  <title>Electroblocks</title>
</svelte:head>

<style>
  .slot-wrapper {
    height: 100%;
    width: 100%;
  }
</style>
