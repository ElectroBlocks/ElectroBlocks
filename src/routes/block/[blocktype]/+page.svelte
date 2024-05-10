<script>
    import Help from '../../../components/electroblocks/block-help/help.svelte'
    import { getBlockHelp } from '../../../help/help-block-list';
    import { page } from '$app/stores';
    const { blocktype } = $page.params;
    const help = getBlockHelp(blocktype);
    
</script>
<style>
    h1 {
        text-align: center;
        margin-top: 20px;
    }
</style>
{#if help}
<Help {help} />
{:else}
<h1>No help found for {blocktype}.</h1>
{/if}


