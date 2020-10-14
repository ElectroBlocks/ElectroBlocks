<script lang="ts"> 
    import About from '../components/settings/About.svelte';
    let settingDisplay;
</script>
<style>
    h1 {
        margin: 10px 5%;
    }
    main {
        margin: 20px 5%;
    }
    select {
        width: 90%;
        padding: 10px;
        margin: 10px auto;
        display: block;
        font-size: 20px;
    }
</style>
<h1>Settings</h1>

<select bind:value={settingDisplay}>
    <option>ToolBox</option>
    <option>Virtual Circuit Settings</option>
    <option>About</option>
    <option>Mailing List</option>
    <option>Report Bugs</option>
    <option>User Settings</option>
    <option>Credits / Thank You</option>
</select>

<main>
    {#if settingDisplay === 'About'}
        <About />
    {/if}
</main>