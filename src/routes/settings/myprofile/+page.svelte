<script lang="ts">
    import { FormGroup, Input, Label, Button } from "@sveltestrap/sveltestrap";

    import Login from "../../../components/auth/Login.svelte";
    import authStore from "../../../stores/auth.store";
    import { saveUserProfile, getUserProfile } from "../../../firebase/db";
    import { onMount } from "svelte";
    import { wait } from "../../../helpers/wait";
    import FlashMessage from "../../../components/electroblocks/ui/FlashMessage.svelte";
    import { onErrorMessage } from "../../../help/alerts";
    let username = "";
    let bio = "";
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
            onErrorMessage("Error Saving Profile", e);
        }
    }

    onMount(async () => {
        const unsub = authStore.subscribe(async (auth) => {
            if (auth.firebaseControlled) {
                const userInfo = await getUserProfile(auth.uid);
                username = userInfo.username;
                bio = userInfo.bio;
                await wait(10);
                unsub();
            }
        });
    });
</script>

{#if $authStore.isLoggedIn}
    <div class="row">
        <div class="col">
            <FormGroup>
                <Label for="username">Username</Label>
                <Input bind:value={username} type="text" id="username" />
            </FormGroup>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <FormGroup>
                <Label for="bio">Bio</Label>
                <Input bind:value={bio} type="textarea" name="text" id="bio" />
            </FormGroup>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <Button color="success" type="button" on:click={save}>Save</Button>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <FlashMessage
                bind:show={showMessage}
                message="Successfully Save." />
        </div>
    </div>
{:else}
    <div class="row">
        <div class="col">
            <p>To access my profile you must login.</p>
            <Login />
        </div>
    </div>
{/if}
