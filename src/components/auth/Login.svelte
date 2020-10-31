

<script lang="ts">
    import { loginGoogleUser } from '../../firebase/auth';
    import { goto } from '@sapper/app'
    
    async function googleLogin() {
        try {
            await loginGoogleUser();
            await goto("/");
        } catch(e) {
            console.log(e);
            alert('error');
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
