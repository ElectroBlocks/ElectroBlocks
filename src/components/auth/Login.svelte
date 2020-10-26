

<script lang="ts">
    import { loginGoogleUser } from '../../firebase/auth';
    
    async function googleLogin() {
        try {
            await loginGoogleUser();
        } catch(e) {
            console.log(e);
            alert('error');
        }
    }
    
</script>

<!-- https://github.com/eswarasai/social-login is where it came from -->
<style>
.login-box {
  	font-family: 'Montserrat', sans-serif;
	box-sizing: border-box;
    background: #fff;
    max-width: 480px;
    text-align: center;
    letter-spacing: 1px;
}

.social-button {
	  background-position: 25px 0px;
    box-sizing: border-box;
    color: rgb(255, 255, 255);
    cursor: pointer;
    display: inline-block;
    height: 50px;
	  line-height: 50px;
    text-align: left;
    text-decoration: none;
    text-transform: uppercase;
    vertical-align: middle;
    width: 100%;
	  border-radius: 3px;
    margin: 10px auto;
    outline: rgb(255, 255, 255) none 0px;
    padding-left: 20%;
    transition: all 0.2s cubic-bezier(0.72, 0.01, 0.56, 1) 0s;
	  -webkit-transition: all .3s ease;
    -moz-transition: all .3s ease;
    -ms-transition: all .3s ease;
    -o-transition: all .3s ease;
    transition: all .3s ease;
}

#google-connect {
    background: rgb(255, 255, 255) url('/social/google-plus.png') no-repeat scroll 5px 0px / 50px 50px padding-box border-box;
    border: 1px solid rgb(220, 74, 61);
}

#google-connect:hover {
	  border-color: rgb(220, 74, 61);
	  background: rgb(220, 74, 61) url('/social/google-plus-white.png') no-repeat scroll 5px 0px / 50px 50px padding-box border-box;
	  -webkit-transition: all .8s ease-out;
    -moz-transition: all .3s ease;
    -ms-transition: all .3s ease;
    -o-transition: all .3s ease;
    transition: all .3s ease-out;
}

#google-connect span {
	  box-sizing: border-box;
    color: rgb(220, 74, 61);
    cursor: pointer;
    text-align: center;
    text-transform: uppercase;
    border: 0px none rgb(220, 74, 61);
    outline: rgb(255, 255, 255) none 0px;
	  -webkit-transition: all .3s ease;
    -moz-transition: all .3s ease;
    -ms-transition: all .3s ease;
    -o-transition: all .3s ease;
    transition: all .3s ease;
}

#google-connect:hover span {
	  color: #FFF;
	  -webkit-transition: all .3s ease;
    -moz-transition: all .3s ease;
    -ms-transition: all .3s ease;
    -o-transition: all .3s ease;
    transition: all .3s ease;
}
</style>

<div class="login-box">
    <button on:click={googleLogin} class="social-button" id="google-connect"> <span>Login with Google</span></button>
</div>