<template>
    <div class="landing">
        <div>
            <h1>Always Stay<br>Motivated</h1>
            <div class="buttons">

                <router-link to="/signin">Sign in</router-link>
                <router-link to="/signup">Sign up</router-link>
            </div>
        </div>
        <img src="@/assets/desktop.png" alt="">
    </div>
</template>
<style scoped>
.buttons {
    display: flex;
    justify-content: space-between;
}

.landing {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100vh;
    user-select: none;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
}

.landing h1 {
    font-size: 5rem;
    font-family: 'Josefin Sans', sans-serif;

}

.landing img {
    width: 100%;
    max-width: 500px;
    background-image: radial-gradient(ellipse 50% 50%, #9440fd 60%, #0f1819);


}

a:nth-of-type(1) {
    background-image: linear-gradient(to right, #9440fd, #fe3d61);
}

a:nth-of-type(2) {
    background-image: linear-gradient(to right, #c63eb3, #40cefd);
}

a {
    padding: 1rem 2rem;
    color: #fff;
    text-decoration: none;
    font-size: 2rem;
    border-radius: 4px;
    background-size: 200% auto;
    box-shadow: 0px 0px 15px 0 rgba(0, 0, 0, .1);
    transition: all 0.4s ease-out;

}

a:hover {
    background-position: right center;
}
</style>
<style>
.landingpage {
    background: #0f1819;
}
</style>
<script>
export default {
    beforeMount() {
        if (this.$store.state.user.email)
            this.$router.push('/dashboard')
        else document.body.className = 'landingpage'


    }
}
</script>