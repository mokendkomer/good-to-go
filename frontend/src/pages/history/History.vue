<template>
	<nav class="desktop">
		<button @click="logout">Logout</button>
	</nav>
	<Error :error="errorMessage" :resolve="() => (errorMessage = '')" v-show="errorMessage"></Error>
	<div class="history">
		<h1 v-if="!user.history.length">Looks like you haven't completed any tasks yet.</h1>
		<div class="task" v-for="task in user.history.slice().reverse()">
			<h2 class="title">{{ task.title }}</h2>
			<p class="date">{{ task.date }}{{ nth(task.date) }} {{
				["January", "February", "March", "April", "May",
					"June", "July", "August", "September", "October", "November", "December"][task.month]
			}}</p>
			<img :src="'/api/images/' + task.image" alt="" v-if="task.image !== 'no image'" class="image" />
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			errorMessage: "",
		};
	},
	computed: {
		user() {
			return this.$store.state.user;
		},
	},

	methods: {
		logout() {
			this.$router.push("/").then(() => {
				this.$store.commit("signIn", {});
			});
		},
		nth(d) {
			if (d > 3 && d < 21) return "th";
			switch (d % 10) {
				case 1:
					return "st";
				case 2:
					return "nd";
				case 3:
					return "rd";
				default:
					return "th";
			}
		},
	},

	beforeCreate() {
		if (!this.$store.state.user.email) this.$router.push("/");
		document.body.className = "dashboardpage";
	},
	mounted() {
		this.social = this.$store.state.user.public.social;
		this.avatar = this.$store.state.user.public.avatar;
		this.visibility = this.$store.state.user.public.visibility;
	},
};
</script>

<style scoped>
.history {
	width: 100%;
	max-width: 700px;
	margin: 2rem auto;
}

.history h1 {
	text-align: center;
	position: absolute;
	top: 40%;
	left: 50%;
	transform: translate(-50%);
}

.task {
	background: #24242490;
	width: 100%;
	border-radius: 2px;
	padding: 1rem;
	margin: 0.5rem 0;
}

.title {
	font-size: 1.5rem;
	font-family: "Josefin Sans", sans-serif;
	margin-top: 0;
}

.date {
	font-family: "Josefin Sans", sans-serif;
}

.image {
	max-width: 100%;
	display: block;
	margin: 1rem auto;
}

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
