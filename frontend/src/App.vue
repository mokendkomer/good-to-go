<template>
	<img class="logo" src="@/assets/logo.png" alt="" @click="$router.push('/')" />
	<div class="phone">
		<h1>Sorry, this experience isn't optimized for your device in this orientation yet. Try landscape mode?</h1>
	</div>
	<!-- <RouterView></RouterView> -->
	<RouterView v-slot="{ Component }">
		<transition name="fade">
			<div>
				<component :is="Component" />
			</div>
		</transition>
	</RouterView>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Josefin+Sans&display=swap");

.v-enter-active,
.v-leave-active {
	transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}

.logo {
	position: absolute;
	top: 1rem;
	left: 1rem;
	width: 300px;
	transition: all ease 0.5s;
	cursor: pointer;
}

.dashboardpage .logo {
	width: 200px;
	top: 0.5rem;
	cursor: unset;
}

body {
	margin: 0;
	background-color: #202020;
	color: #eee;
	font-family: "Inter", sans-serif;
	background: url("@/assets/background.jpg") no-repeat center center fixed;
	background-size: cover;
}

.signpage {
	background: url("@/assets/signbackground.gif") no-repeat center center fixed;
	background-size: cover;
	transition: backdrop-filter ease 5s;
}

.backgroundtransition {
	backdrop-filter: blur(30px);
}

.vue-simple-context-menu,
.vue-simple-context-menu__item:hover {
	background-color: #ff4b4b;
	color: #fff;
}

.vue-simple-context-menu__item {
	color: #fff;
	margin: 0 !important;
	padding: 10px 15px;
}

.phone {
	display: none;
}

@media screen and (max-width: 768px) {
	#app * {
		display: none;
	}

	#app .phone,
	#app .phone * {
		display: block !important;
		margin: 1rem;
	}

	.desktop {
		display: none !important;
	}
}
</style>
