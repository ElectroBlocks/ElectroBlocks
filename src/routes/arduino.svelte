<script lang="ts">
  import VerticalComponentContainer from "../components/electroblocks/VerticalComponentContainer.svelte";
  import Debug from "../components/electroblocks/arduino/Debug.svelte";
  import Message from "../components/electroblocks/arduino/Message.svelte";
  import { onMount } from "svelte";
  import InAppTutorialFeter from "../lessons/InAppTutorialFetcher";
  import { stores } from "@sapper/app";
  import { onErrorMessage } from "../help/alerts";
  import config from "../env";
  const { page } = stores();

  onMount(async () => {
    // todo move this layout view
    const inAppTutorialFetcher = new InAppTutorialFeter(config.site);
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
    <Message />
  </div>
  <div class="slot-wrapper" slot="bottom">
    <Debug />
  </div>
</VerticalComponentContainer>
<svelte:head>
  <title>ElectroBlocks - Arduino</title>
</svelte:head>

<style>
  .slot-wrapper {
    height: 100%;
    width: 100%;
  }
</style>
