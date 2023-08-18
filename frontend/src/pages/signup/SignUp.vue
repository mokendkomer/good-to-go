<template>
    <Error :error="errorMessage" :resolve="() => errorMessage = ''" v-show="errorMessage"></Error>
    <div class="login">
        <div class="left">
            <img src="@/assets/user.svg" class='usericon' alt="">
            <div class="border"></div>
            <p class="welcome-note">Welcome to Good to Go! Since this is your first time, we'll need some of your
                details to
                get to know you
                better.<br><br>We promise to never misuse your data.</p>
        </div>
        <form class="right" @submit="submitForm">
            <div class="input">
                <img src="@/assets/username.svg" alt="">
                <input type="text" placeholder="Name" v-model="name">
            </div>
            <div class="input">
                <img src="@/assets/email.svg" alt="">
                <input type="email" placeholder="E-mail" v-model="email">
            </div>
            <div class="input">
                <img src="@/assets/password.svg" alt="">
                <input type="password" placeholder="Password" v-model="password">
            </div>
            <div class="input">
                <img src="@/assets/confirmpassword.svg" alt="">
                <input type="password" placeholder="Confirm Password" v-model="confirmpassword">
            </div>
            <div class="checkbox">
                <p>Would you like to be visible to other users?</p>
                <input class="tgl tgl-flip" id="visible" type="checkbox" v-model="visibility">
                <label class="tgl-btn" for="visible" data-tg-off='Nope.' data-tg-on="Yeah!"></label>
            </div>
            <div class="buttons">
                <router-link class="button" to="/signin">Sign in instead</router-link>
                <input type="submit" value="Go" class="button submit">
            </div>
        </form>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            email: '', name: '', password: '', confirmpassword: '', visibility: false,
            errorMessage: ''
        }

    },
    methods: {
        submitForm(e) {
            e.preventDefault()
            if (
                !this.name.length ||
                !this.email.length ||
                !this.password.length ||
                !this.confirmpassword.length)
                return this.errorMessage = "Please fill all fields."

            if (this.password !== this.confirmpassword)
                return this.errorMessage = "Those passwords didn't match. Please try again."

            fetch("/api/newuser", {
                headers: {
                    "Content-type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    name: this.name,
                    email: this.email,
                    visibility: this.visibility,
                    password: this.password
                }),
            }).then(res => res.json().then(data => {
                if (data.error) this.errorMessage = data.error
                else {
                    this.$store.commit('signIn', data)
                    this.$router.push("/dashboard");

                }
            }))

        }
    },
    computed: mapState([
        'user'
    ]),
    beforeMount() {
        if (this.$store.state.user.email)
            this.$router.push('/dashboard')
        else document.body.className = 'signpage'
    },
    mounted() {
        document.querySelector('body').classList.add('backgroundtransition')
    }

}

</script>

<style scoped>
.welcome-note {
    color: #fff;
    font-size: 1.2rem;
    text-align: center;
}

.border {
    height: 3px;
    background: #fff;
    border-radius: 3px;
    width: 80%;
    margin: 0 auto;
    margin-bottom: 1rem;

}

.login {
    height: 100vh;
    display: flex;
    justify-content: center;
}

.left,
.right {
    width: 100%;
    max-width: 500px;
    margin: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 5rem;

}

.login form {
    text-align: center;

}

.login .usericon {
    filter: invert();
    margin: 0 auto 1rem;
    width: 60%;
}

.input {
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
}

.input img {
    filter: invert();
    margin-right: 1rem;
}

.input input {
    border-radius: 2rem;
    font-size: 1.2rem;
    width: 70%;
    text-align: center;
    outline: none !important;
    border: 0;

}

.input input::placeholder {
    color: #000 !important;
}

.button {
    background-color: transparent;
    text-decoration: none;
    border: #fff 2px solid;
    color: #fff;
    font-size: 1.5rem;
    padding: 10px 20px;
    border-radius: 2rem;
    margin-top: 2rem;
    cursor: pointer;

}

.submit {
    background-color: #fff;
    color: #d704f5;

}

.buttons {
    display: flex;
    justify-content: space-around;
}

#visible {
    display: none;
}

.checkbox {
    margin-top: 1rem;
    display: flex;
    justify-content: space-around;
    font-size: 1.2rem;
    align-items: center;
}

.checkbox p {
    margin: 0;
}

.tgl {
    display: none;
}

.tgl,
.tgl:after,
.tgl:before,
.tgl *,
.tgl *:after,
.tgl *:before,
.tgl+.tgl-btn {
    box-sizing: border-box;
}

.tgl::selection,
.tgl:after::selection,
.tgl:before::selection,
.tgl *::selection,
.tgl *:after::selection,
.tgl *:before::selection,
.tgl+.tgl-btn::selection {
    background: none;
}

.tgl+.tgl-btn {
    outline: 0;
    display: block;
    width: 4em;
    height: 2em;
    position: relative;
    cursor: pointer;
    user-select: none;
}

.tgl+.tgl-btn:after,
.tgl+.tgl-btn:before {
    position: relative;
    display: block;
    content: "";
    width: 50%;
    height: 100%;
}

.tgl+.tgl-btn:after {
    left: 0;
}

.tgl+.tgl-btn:before {
    display: none;
}

.tgl:checked+.tgl-btn:after {
    left: 50%;
}

.tgl-flip+.tgl-btn {
    padding: 2px;
    transition: all 0.2s ease;
    font-family: sans-serif;
    perspective: 100px;
}

.tgl-flip+.tgl-btn:after,
.tgl-flip+.tgl-btn:before {
    display: inline-block;
    transition: all 0.4s ease;
    width: 100%;
    text-align: center;
    position: absolute;
    line-height: 2em;
    font-weight: bold;
    color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    backface-visibility: hidden;
    border-radius: 4px;
}

.tgl-flip+.tgl-btn:after {
    content: attr(data-tg-on);
    background: #02c66f;
    transform: rotateY(-180deg);
}

.tgl-flip+.tgl-btn:before {
    background: #ff3a19;
    content: attr(data-tg-off);
}

.tgl-flip+.tgl-btn:active:before {
    transform: rotateY(-20deg);
}

.tgl-flip:checked+.tgl-btn:before {
    transform: rotateY(180deg);
}

.tgl-flip:checked+.tgl-btn:after {
    transform: rotateY(0);
    left: 0;
    background: #7fc6a6;
}

.tgl-flip:checked+.tgl-btn:active:after {
    transform: rotateY(20deg);
}

.checkbox input {
    /* width: 1.2rem; */
    outline: 0;
    display: block;
    width: 4em;
    height: 2em;
    position: relative;
    cursor: pointer;
    user-select: none;

}

.checkbox input {

    padding: 2px;
    transition: all .2s ease;
    font-family: sans-serif;
    perspective: 100px;
}
</style>
