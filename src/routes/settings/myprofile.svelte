<script lang="ts">
    import Login from '../../components/auth/Login.svelte';
    import authStore from '../../stores/auth.store';
    import { saveUserProfile, getUserProfile } from "../../firebase/db";
    import { onMount } from "svelte";
    import { wait } from '../../helpers/wait';
    import FlashMessage from '../../components/electroblocks/ui/FlashMessage.svelte';
    let username = '';
    let bio = '';
    let canSave = true;
    let showMessage = false;
    async function save() {
        if (!canSave) return;
        try {
            canSave = false;
            await saveUserProfile(username, bio, $authStore.uid);
            await wait(2000);
            canSave = true;
            showMessage = true;
        } catch (e) {
            console.log(e);
            // todo figure out errors
        }
    }

    onMount(async () => {
       const unsub = authStore.subscribe(async auth => {
            if (auth.firebaseControlled) {
                const userInfo =await getUserProfile(auth.uid);
                username = userInfo.username;
                bio = userInfo.bio;
                await wait(10);
                unsub(); 
            }
        })
    })
</script>

<style>
    #btn-container {
        height: 30px;
        width: 100%;
    }
</style>

{#if $authStore.isLoggedIn}

    <label class="form" for="username">Username</label>
    <input class="form" bind:value={username} type="text"  id="username" />
    <label class="form" for="bio">Bio</label>
    <textarea class="form" bind:value={bio} id="bio"></textarea>
    <div id="btn-container">
        <button class="form" disabled={!canSave} on:click={save} id="save">Save</button>
    </div>
    <FlashMessage bind:show={showMessage} message="Successfully Save." />

    {:else}
    <p>To access my profile you must login.</p>
    <Login />
{/if}