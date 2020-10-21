<script lang="ts">
    import userStore from '../../stores/user.store';
    import Login from '../../components/auth/Login.svelte';

</script>

<style>
    button {
        float: right;
    }
</style>

{#if $userStore}
        <div class="row">
            <label for="project-name">Name</label>
            <input id="project-name" type="text">
        </div>
        <div class="row">
            <label for="project-description">Description</label>
            <textarea  id="project-description" cols="30" rows="10"></textarea>
        </div>
            <div class="row">
        <button class="btn">Save</button>
    </div>
    {:else}
    <p>To Save project you must be logged in.  If you don't want to login you can go to the <a href="/projects/download">download page</a> to download the code or project onto your computer.</p>
    <Login />
{/if}