<template>
    <Error :error="errorMessage" :resolve="() => errorMessage = ''" v-show="errorMessage"></Error>
    <div class="login">
        <img src="@/assets/user.svg" class='usericon' alt="">
        <div class="border"></div>
        <form @submit="submitForm">
            <div class="input">
                <img src="@/assets/username.svg" alt="">
                <input type="email" placeholder="E-mail" v-model="email">
            </div>
            <div class="input">
                <img src="@/assets/password.svg" alt="">
                <input type="password" placeholder="Password" v-model="password">
            </div>
            <div class="buttons">
                <router-link class="button" to="/signup">Sign up instead</router-link>
                <input type="submit" value="Go" class="button submit">
            </div>
        </form>
    </div>
</template>
<style scoped>
.border {
    height: 3px;
    background: #fff;
    border-radius: 3px;
    width: 80%;
    margin: 0 auto;
    margin-top: -0.5rem;
    margin-bottom: 1.5rem;

}

.login {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
    margin-top: 0.5rem;
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
</style>
<script>

import { mapState } from 'vuex'
export default {
    data() {
        return {
            email: '', password: '',
            errorMessage: ''
        }

    },
    methods: {
        submitForm(e) {
            e.preventDefault()
            const talkToAPI = async () => {
                const res = await fetch("/api/auth", {
                    headers: {
                        "Content-type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify({
                        email: this.email,
                        password: this.password
                    }),
                })
                const data = await res.json()
                return data
            }
            talkToAPI().then(data => {
                if (data.error)
                    return this.errorMessage = data.error
                else {
                    this.$store.commit('signIn', data)
                    this.$router.push("/dashboard");
                }

            })

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