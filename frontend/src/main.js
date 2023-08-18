import { createApp } from "vue";
import { createStore } from "vuex";
import { createRouter, createWebHistory } from "vue-router";
import createPersistedState from "vuex-persistedstate";
import VueSimpleContextMenu from "vue-simple-context-menu";
import "vue-simple-context-menu/dist/vue-simple-context-menu.css";

import App from "./App.vue";

import SignIn from "./pages/signin/SignIn.vue";
import SignUp from "./pages/signup/SignUp.vue";
import Dashboard from "./pages/dashboard/Dashboard.vue";
import Profile from "./pages/profile/Profile.vue";
import Home from "./pages/home/Home.vue";
import Settings from "./pages/settings/Settings.vue";
import History from "./pages/history/History.vue";
import Error from "@/components/error/Error.vue";

const updateDB = (state) => {
	fetch("/api/update", {
		headers: {
			"Content-type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({ ...state.user }),
	}).then((res) => res.json().then((data) => console.log(data)));
};

const store = createStore({
	plugins: [createPersistedState({ storage: window.sessionStorage })],
	state() {
		return {
			user: {},
		};
	},
	mutations: {
		signIn(state, payload) {
			state.user = payload;
		},
		addTask(state, payload) {
			if (!payload.category || !payload.task) alert("No task found");
			state.user.categories.find((a) => a.categoryName === payload.category).tasks.push({ id: Math.floor(Math.random() * 1000), title: payload.task });
			updateDB(state);
		},
		addCategory(state, payload) {
			state.user.categories.push({ categoryName: payload.category, tasks: [] });
			updateDB(state);
		},
		deleteCategory(state, payload) {
			state.user.categories = state.user.categories.filter((a) => a.categoryName !== payload.category);
			updateDB(state);
		},
		updateTasks(state, payload) {
			state.user = payload;
			updateDB(state);
		},
	},
});

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: "/signin", component: SignIn },
		{ path: "/signup", component: SignUp },
		{ path: "/dashboard", component: Dashboard },
		{ path: "/settings", component: Settings },
		{ path: "/profile/:id", component: Profile },
		{ path: "/history", component: History },
		{ path: "/", component: Home },
	],
});

const app = createApp(App);
app.component("vue-simple-context-menu", VueSimpleContextMenu);
app.component("Error", Error);
app.use(store);
app.use(router);
app.mount("#app");
