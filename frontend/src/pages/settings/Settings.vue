<template>
    <nav class="desktop">
        <button @click="logout">Logout</button>
    </nav>
    <Error :error="errorMessage" :resolve="() => errorMessage = ''" v-show="errorMessage"></Error>
    <div class="settings">
        <div class="change-avatar">
            <h1 class="heading">Your profile</h1>
            <img :src="'/api/images/' + avatar" alt="" class="set-avatar">
            <form action="/api/upload" method="post" enctype="multipart/form-data" ref="avatarForm">
                <input type="file" id="file" name="image" @change="ppsave" />
                <label class="button" for="file">Change avatar</label>
            </form>
        </div>
        <div class="change-socials">

            <h1 class="heading">Social media</h1>
            <form class="socials" @submit="save">
                <div class="social">
                    <img src="@/assets/social/ig.svg" alt="">
                    <input type="text" v-model="social.ig" placeholder="Profile link">
                </div>
                <div class="social">
                    <img src="@/assets/social/tw.svg" alt="">
                    <input type="text" v-model="social.tw" placeholder="Profile link">
                </div>
                <div class="social">
                    <img src="@/assets/social/em.svg" alt="">
                    <input type="text" v-model="social.em" placeholder="Profile link">
                </div>
                <div class="social">
                    <img src="@/assets/social/sc.svg" alt="">
                    <input type="text" v-model="social.sc" placeholder="Username">
                </div>
                <div class="checkbox">
                    <p>Would you like to be visible to other users?</p>
                    <input class="tgl tgl-flip" id="visible" type="checkbox" v-model="visibility">
                    <label class="tgl-btn" for="visible" data-tg-off='Nope.' data-tg-on="Yeah!"></label>
                </div>

                <input type="submit" value="Save" class="save">
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            errorMessage: '',
            social: { "ig": "", "tw": "", "em": "", "sc": "" },
            avatar: '',
            visibility: false,
        }
    },
    computed: {
        user() {
            return this.$store.state.user
        },
    },


    methods: {
        ppsave(e) {
            const formData = new FormData(this.$refs.avatarForm)

            fetch('/api/upload', {
                method: 'POST',
                body: formData
            }).then(a => a.json()).then(data => this.avatar = data.filename);

        },
        logout() {
            this.$router.push('/').then(() => {
                this.$store.commit('signIn', {})
            })
        },
        save(e) {
            e.preventDefault()
            const newUser = { ...this.user }
            newUser.public.social = this.social
            if (this.social.sc.length && !this.social.sc.startsWith('https://'))
                newUser.public.social.sc = `https://snapchat.com/add/${this.social.sc}`
            newUser.public.avatar = this.avatar
            newUser.public.visibility = this.visibility
            this.$store.commit('updateTasks', newUser)
            if (this.visibility)
                this.$router.push('/profile/' + this.user._id)
            else
                this.$router.push('/dashboard')


        }
    },


    beforeCreate() {
        if (!this.$store.state.user.email)
            this.$router.push("/");
        document.body.className = 'dashboardpage'

    },
    mounted() {
        this.social = this.$store.state.user.public.social;
        this.avatar = this.$store.state.user.public.avatar;
        this.visibility = this.$store.state.user.public.visibility

    }
}
</script>

<style scoped>
input[type="file"] {
    display: none;
}

.button {
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: inline-block;
    outline: none;
    overflow: hidden;
    border-radius: 2px;
    border: none;
    background-color: #00a38d;
    font-size: 1rem;
    padding: 5px 10px;
    margin-top: 1rem;
}

/* input[type="file"] label {
    display: block;
    position: relative;
    width: 200px;
    height: 50px;
    border-radius: 25px;
    background: linear-gradient(40deg, #ff6ec4, #7873f5);
    box-shadow: 0 4px 7px rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: transform .2s ease-out;
} */

.set-avatar {
    width: 50%;
    margin: 0 auto;
}

.pp {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
}

h1.heading {
    font-size: 3rem;
    text-align: center;
    margin: 0;
    font-family: 'Josefin Sans', sans-serif;
    margin-bottom: 2rem;

}

.settings {
    width: 100%;
    /* max-width: 500px; */
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    /* flex-direction: column;
    height: 80vh;
    justify-content: baseline; */

}

.change-avatar,
.change-socials {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    height: 80vh;
    justify-content: center;

}

.change-avatar {
    align-items: center;

}

.social {
    display: flex;
    justify-content: center;
    align-items: center;
}

.social input {
    font-size: 1.2rem;
    width: 100%;
    outline: none !important;
    border: 0 !important;
    border-radius: 3px;
    padding: 3px 5px;
}

.socials img {
    filter: invert(1);
    width: 3rem;
    margin: 0 0.5rem;
}





nav button,
.save {


    min-width: 40px;
    height: 40px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: inline-block;
    outline: none;
    overflow: hidden;
    border-radius: 2px;
    border: none;
    background-color: #00a38d;
    font-size: 1rem;
    margin-left: 1rem;

}

.save {
    margin: 0;
    margin-top: 1rem;
    display: block;
    margin-left: auto;
    font-size: 1.5rem;
    padding: 1rem;
    height: unset
}


nav {
    background: #24242480;
    height: 3rem;
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 0 5px;
}

* {
    user-select: none;

}

p {
    margin: 0;
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
</style>
