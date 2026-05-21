<script>
  import { onMount } from "svelte";

  onMount(async () => {
      localStorage.removeItem("reload_once_workspace");
      window.location.href = '/';
  });
</script>