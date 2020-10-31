<script lang="ts">
    import Login from '../../components/auth/Login.svelte';
    import authStore from '../../stores/auth.store';
    import { saveUserProfile, getUserProfile } from "../../firebase/db";
    import { onMount } from "svelte";
    import { wait } from '../../helpers/wait';
    let username = '';
    let bio = '';
    let canSave = true;
    async function save() {
        if (!canSave) return;
        try {
            canSave = false;
            await saveUserProfile(username, bio, $authStore.uid);
            await wait(2000);
            canSave = true;
        } catch (e) {
            console.log(e);
            // todo figure out errors
        }
    }

    onMount(async () => {
       const unsub = authStore.subscribe(async auth => {
            if (auth.firebaseControlled) {
                unsub();
                const userInfo =await getUserProfile(auth.uid);
                username = userInfo.username;
                bio = userInfo.bio;
            }
        })
    })
</script>

{#if $authStore.isLoggedIn}

    <label class="form" for="username">Username</label>
    <input class="form" bind:value={username} type="text"  id="username" />
    <label class="form" for="bio">Bio</label>
    <textarea class="form" bind:value={bio} id="bio"></textarea>
    <button class="form" disabled={!canSave} on:click={save} id="save">Save</button>

    {:else}
    <p>To access my profile you must login.</p>
    <Login />
{/if}