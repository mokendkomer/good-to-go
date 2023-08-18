<template>
    <nav class="desktop">
        <button @click="$router.push('/settings')" class="settings-button"><img src="@/assets/settings.svg"></button>

        <button @click="logout">Logout</button>
    </nav>

    <Error :error="errorMessage" :resolve="() => errorMessage = ''" v-show="errorMessage"></Error>
    <div class="profile">
        <div class="profile-head">

            <img :src="'/api/images/' + profile.avatar" alt="" class="profile-avatar">
            <h1 class="name">{{ profile.name }}</h1>
        </div>
        <div class="completed-tasks">
            <h1>Tasks<br>completed</h1>
            <div class="stats">
                <div class="stat">
                    <h3>This day</h3>
                    <h3> {{ day.length }}</h3>
                </div>
                <div class="stat">
                    <h3>This month</h3>
                    <h3> {{ month.length }}</h3>
                </div>
                <div class="stat">
                    <h3>This year</h3>
                    <h3> {{ year.length }}</h3>
                </div>
            </div>
        </div>
        <div :class="['score', score]">
            <h1>Monthly score: {{ score }}</h1>

        </div>
        <div class="social">
            <a v-show="profile.social.ig.length" :href=profile.social.ig>
                <img src="@/assets/social/ig.svg" alt="">
            </a>
            <a v-show="profile.social.tw.length" :href=profile.social.tw>
                <img src="@/assets/social/tw.svg" alt="">
            </a>
            <a v-show="profile.social.em.length" :href=profile.social.em>
                <img src="@/assets/social/em.svg" alt="">
            </a>
            <a v-show="profile.social.sc.length" :href=profile.social.sc>
                <img src="@/assets/social/sc.svg" alt="">
            </a>
            <a role="button" @click="toggleFollow" v-if="profile.id !== user._id">


                <img v-if="user.public.following.includes(profile.id)" src="@/assets/unfollow.svg" alt="unfollow" />
                <img v-else="user.public.following.includes(profile.id)" src="@/assets/follow.svg" alt="follow" />
            </a>
            <a role="button" @click="$router.push('/settings')" v-else>
                <img src='@/assets/edit.svg' alt="">
            </a>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            profile: { id: '', social: { ig: "", tw: "", em: "", sc: "" }, name: "", history: [], visibility: false },
            query: '',
            searchResults: [],

            errorMessage: ''
        }
    },
    computed: {
        user() {
            return this.$store.state.user
        },
        year() {
            return this.profile.history.filter(a => a.year === new Date().getFullYear())
        },
        month() {
            return this.year.filter(a => a.month === new Date().getMonth())
        },
        day() {
            return this.year.filter(a => a.date === new Date().getDate())
        },
        score() {
            const val = this.month.length / new Date().getDate()
            if (val < 2)
                return 'absolute trash'
            if (val < 5)
                return 'do better lmao'
            if (val < 8)
                return 'ehh'
            if (val > 10)
                return 'goodman'

        },
    },


    methods: {

        toggleFollow() {
            const newUser = { ...this.user }
            if (this.user.public.following.includes(this.profile.id))
                newUser.public.following = this.user.public.following.filter(a => a !== this.profile.id)
            else newUser.public.following.push(this.profile.id)
            this.$store.commit('updateTasks', newUser)

        },
        logout() {
            this.$router.push('/').then(() => {
                this.$store.commit('signIn', {})
            })
        },
    },


    beforeCreate() {
        if (!this.$store.state.user.email)
            this.$router.push("/");
        document.body.className = 'dashboardpage'
        fetch(`/api/profile/${this.$route.params.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    if (data.error === 'user is private')
                        return this.errorMessage = "The user is private"
                    return this.errorMessage = "User wasn't found"
                }
                this.profile = data
            })


    },

}
</script>

<style scoped>
.score {

    text-align: center;
}

.lead h1 {
    background: #6b6b6b;
}

.bronze h1 {
    background: #CD7F32;
    color: black;
}

.silver h1 {
    background: #C0C0C0;
    color: black;
}


.gold h1 {
    background: #FFD700;
    color: black;
}

.score h1 {
    display: inline-block;
    padding: 10px 20px;
    border-radius: 4px;

}

.score {
    border-radius: 5px;
}

.score h1 {
    font-weight: 400;
    font-size: 2rem;
    text-align: center;
    margin-top: 0;

}


.settings-button {
    display: flex;
    justify-content: center;
    align-items: center;
}

.settings-button img {
    filter: invert(1);
    width: 30px;


}

.profile-head {
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.profile-avatar {
    width: 100%;
    max-width: 150px;
    border-radius: 10px;
}

h1.name {
    font-size: 5rem;
    text-align: center;
    margin: 0;
}

.profile {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    height: 90vh;
    justify-content: center;
    font-family: 'Josefin Sans', sans-serif;
}

.completed-tasks {
    display: flex;
    align-items: center;
    gap: 2rem;
    justify-content: space-around;
    margin: 1rem 0;

}

.completed-tasks h1 {
    font-size: 4rem;
    font-weight: 400;

}

.stats h3 {
    font-size: 1.8rem;
    font-weight: 400;

}

.stat {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
}

.social img {
    filter: invert(1);
    width: 4rem;
    margin: 0 0.5rem;
    cursor: pointer;
}

.social {
    margin: 0 auto;
    width: fit-content
}



/* .social {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%);
} */

nav button {


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
</style>
