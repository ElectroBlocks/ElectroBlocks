<script lang="ts"> 
    import About from '../components/settings/About.svelte';
    import VirtualCircuitSettings from '../components/settings/VirtualCircuitSettings.svelte';
    
    import ToolBox from '../components/settings/ToolBox.svelte';
    import MailingList from '../components/settings/MailingList.svelte';
    import ReportBugs from '../components/settings/ReportBugs.svelte';
    import UserSettings from '../components/settings/UserSettings.svelte';
    import Credits from '../components/settings/Credits.svelte';

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
    <option>Credits</option>
</select>

<main>
    {#if settingDisplay === 'ToolBox'}
        <ToolBox />
    {/if}
    {#if settingDisplay === 'About'}
        <About />
    {/if}
    {#if settingDisplay === 'Virtual Circuit Settings'}
        <VirtualCircuitSettings />
    {/if}
    {#if settingDisplay === 'Mailing List'}
        <MailingList />
    {/if}

    {#if settingDisplay === 'Report Bugs'}
        <ReportBugs />
    {/if}

    {#if settingDisplay === 'User Settings'}
        <UserSettings />    
    {/if}

    {#if settingDisplay === 'Credits'}
        <Credits />
    {/if}

</main>