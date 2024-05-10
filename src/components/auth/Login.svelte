

<script lang="ts">
    import { loginGoogleUser } from '../../firebase/auth';
    import { goto } from '$app/navigation';
    import { onErrorMessage } from '../../help/alerts';
    
    async function googleLogin() {
        try {
            await loginGoogleUser();
            await goto("/");
        } catch(e) {
            if (e.code === "auth/cancelled-popup-request") {
                return;
            }
            onErrorMessage("Sorry, please try again in 5 minutes. :)", e);
        }
    }
    
</script>

<style>
    img {
    display: block;
    margin: auto;
    width: 200px;
    margin-top: 20px;
}
</style>

<img src="/signin-btn.png" on:click={googleLogin} alt="google sign">
