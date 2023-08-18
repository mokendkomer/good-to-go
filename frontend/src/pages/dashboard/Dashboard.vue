<template>
    <nav class="desktop">
        <input type="text" @keyup="search" v-model="query" class="search-box" @focusout="clearQuery" />
        <div class="search-results" v-show="query.length">
            <router-link class="search-result" v-for="result in searchResults.filter((a) => a.id !== user._id)"
                :to="'/profile/' + result.id">
                <img class="avatar" :src="'/api/images/' + result.avatar" alt="" />
                <p class="name">
                    {{ result.name }}
                </p>
            </router-link>
        </div>
        <button @click="adding = 'task'">&plus;</button>
        <button @click="$router.push('/settings')" class="settings-button"><img src="@/assets/settings.svg" /></button>
        <button @click="$router.push('/history')" class="settings-button"><img src="@/assets/history.svg" /></button>
        <button @click="logout">Logout</button>
    </nav>
    <div class="modal-background add-task" v-show="adding || finishing.id" @click="closeModal">
        <div class="modal" @click.stop>
            <div class="modal-heading">
                <h2>{{ adding ? `Add ${adding}` : `Finish ${finishing.title}` }}</h2>
                <h2 @click.stop="closeModal">&#10005;</h2>
            </div>
            <p class="error-text" v-show="modalError.length">{{ modalError }}</p>
            <form @submit="add" v-show="adding">
                <input ref="addfield" type="text" v-model="addText" :class="modalError.length ? 'error' : null" />
                <button>&plus;</button>
            </form>
            <form action="/api/upload" class="finishing-buttons" method="post" enctype="multipart/form-data"
                ref="dismissForm" v-show="finishing.id">
                <input type="file" id="file" name="image" @change="dismiss()" />
                <label class="button" for="file">Upload image</label>
                <div class="button" @click="removeTask('no image')">Finish without an image</div>
            </form>
        </div>
    </div>
    <Error :error="errorMessage" :resolve="() => (errorMessage = '')" v-show="errorMessage"></Error>
    <vue-simple-context-menu element-id="myUniqueId" :options="[
        {
            name: `Delete`,
            slug: 'delete',
        },
    ]" ref="vueSimpleContextMenu" @option-clicked="optionClicked()" />

    <div class="desktop dashboard">
        <div class="side-pane">
            <div class="categories">
                <div v-for="category in user.categories"
                    @contextmenu.prevent.stop="deleteMenu($event, category.categoryName)"
                    @click="select(category.categoryName)"
                    :class="['category', category.categoryName === selectedCategory ? 'selected' : null]">
                    <p class="name">{{ category.categoryName }}</p>
                    <p class="count">{{ category.tasks.length }}</p>
                </div>
                <button @click="adding = 'category'" class="add-category">&plus;</button>
            </div>

            <div class="following">
                <router-link :to="'/profile/' + person.id" v-for="person in following" class="follow">
                    <img :src="'/api/images/' + person.avatar" alt="" class="follow-avatar" />
                    <p class="follow-name">{{ person.name }}</p>
                </router-link>
            </div>
        </div>

        <div class="taskview-outer">
            <div class="taskview-inner">
                <h2 class="category-heading">{{ selectedCategory }}</h2>
                <div class="tasks">
                    <div v-for="task in user.categories.find((category) => category.categoryName === selectedCategory).tasks"
                        class="task">
                        <button @click="finishing = { id: task.id, title: task.title }">Done</button>
                        <p class="task-text">
                            {{ task.title }}
                        </p>
                    </div>
                    <h3 class="no-tasks"
                        v-show="!user.categories.find((category) => category.categoryName === selectedCategory).tasks.length">
                        Looks like this category doesn't have any tasks.</h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    data() {
        return {
            selectedCategory: this.$store.state.user.categories[0].categoryName,
            deletingCategory: "",
            adding: null,
            addText: "",
            modalError: "",
            errorMessage: "",
            query: "",
            searchResults: [],
            following: [],
            finishing: {
                title: "",
                id: "",
            },
        };
    },
    computed: mapState(["user"]),

    methods: {
        clearQuery() {
            setTimeout(() => (this.query = ""), 200);
        },
        search() {
            if (this.query === "") return (this.searchResults = []);
            fetch("/api/profilesearch/" + this.query)
                .then((a) => a.json())
                .then((data) => (this.searchResults = data));
        },
        closeModal() {
            this.adding = null;
            this.modalError = "";
            this.addText = "";
            this.finishing = { id: "", title: "" };
        },
        deleteMenu(event, item) {
            this.$refs.vueSimpleContextMenu.showMenu(event, item);
            this.deletingCategory = item;
        },

        optionClicked(event) {
            if (this.user.categories.length < 2) return (this.errorMessage = "Please add another collection to delete this one.");
            if (this.deletingCategory === this.selectedCategory) this.selectedCategory = this.user.categories[0].categoryName;
            this.$store.commit("deleteCategory", { category: this.deletingCategory });
        },

        logout() {
            this.$router.push("/").then(() => {
                this.$store.commit("signIn", {});
                this.$router.go();
            });
        },
        select(name) {
            this.selectedCategory = name;
        },
        dismiss() {
            const formData = new FormData(this.$refs.dismissForm);
            fetch("/api/upload", {
                method: "POST",
                body: formData,
            })
                .then((a) => a.json())
                .then((data) => {
                    if (data.error) this.removeTask("no image");
                    this.removeTask(data.filename);
                });
        },
        removeTask(image) {
            const newUser = { ...this.user };
            const task = this.user.categories.find((category) => category.categoryName === this.selectedCategory).tasks.find((task) => task.id === this.finishing.id);
            newUser.categories.find((a) => a.categoryName === this.selectedCategory).tasks = this.user.categories.find((category) => category.categoryName === this.selectedCategory).tasks.filter((task) => task.id !== this.finishing.id);
            const now = new Date();
            newUser.history.push({ date: now.getDate(), month: now.getMonth(), year: now.getFullYear(), title: task.title, image: image });
            this.$store.commit("updateTasks", newUser);
            this.closeModal();
        },
        add(e) {
            e.preventDefault();
            if (!this.addText.length) {
                this.modalError = `Please enter some text.`;
            } else {
                if (this.adding === "task") {
                    this.$store.commit("addTask", { category: this.selectedCategory, task: this.addText });
                } else if (this.adding === "category") {
                    if (this.user.categories.find((a) => a.categoryName === this.addText)) {
                        this.modalError = `You already have a category named '${this.addText}'.`;
                        return;
                    }

                    this.$store.commit("addCategory", { category: this.addText });
                    this.selectedCategory = this.addText;
                }
                this.adding = null;
                this.addText = "";
            }
        },
        addListener(event) {
            if (event.key === "Escape") {
                if (this.adding)
                    this.closeModal()
                else
                    this.adding = 'task'
            }
        }

    },

    watch: {
        adding(newVal) {
            if (newVal) setTimeout(() => this.$refs.addfield.focus(), 0); //weird workaround for weird bug
        },
    },

    beforeCreate() {
        if (!this.$store.state.user.email) this.$router.push("/");
        document.body.className = "dashboardpage";
    },
    created() {
        this.user.public.following.forEach((person) => {
            fetch("/api/profile/" + person)
                .then((a) => a.json())
                .then((data) => this.following.push(data));
        });
        window.addEventListener("keydown", this.addListener);

    },
    destroyed() {
        window.removeEventListener("keydown", this.addListener);

    }
};
</script>

<style scoped>
.finishing-buttons .button {
    margin: 0 0.5rem;
    font-size: 400;
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

input[type="file"] {
    display: none;
}

.follow {
    display: flex;
    width: 100%;
    color: #fff;
    text-decoration: none;
    align-items: center;
    gap: 5px;
    height: 50px;
    overflow: hidden;

    padding: 0.5rem 1rem;
    border-radius: 2px;
    box-sizing: border-box;
}

.follow-name {
    overflow: hidden;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-right: 4px;
}

.follow:hover {
    background: #666;
}

.follow-avatar {
    width: 30px;
}

.following {
    position: absolute;
    bottom: 0;
    width: 15rem;
    max-height: 50%;
    overflow-y: auto;
    min-width: 10rem;
}

.search-results {
    z-index: 1;
    position: absolute;
    top: 50px;
    right: 205px;
}

.search-result {
    background: #444;
    padding: 10px;
    width: 350px;
    display: block;
    color: #fff;
    text-decoration: none;
    font-size: 1.2rem;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
}

.search-result:hover {
    background: #666;
}

.search-result .avatar {
    width: 40px;
    height: 40px;
    margin-right: 1rem;
}

.search-box {
    width: 40px;
    height: 40px;
    box-sizing: border-box;
    font-size: 1.5rem;
    outline: 0;
    background-size: cover !important;
    background-repeat: no-repeat;
    box-shadow: none;
    border: 0;
    transition: all 0.5s ease-in-out;
    background: url("@/assets/search.jpg");
    border-radius: 3px;
    padding: 5px 10px;
    color: #fff;
    cursor: pointer;
}

.search-box::placeholder {
    color: #fff;
    content: "blah";
}

.search-box:focus {
    width: 20%;
    font-size: 1.2rem;
    outline: 0;
    border: 1px #00a38d solid;
    background: transparent;
    border-radius: 3px;
    padding: 5px 10px;
    color: #fff;
    transition: width 0.5s ease-in-out;
    cursor: unset;
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

button.add-category {
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
    font-size: 2rem;
    width: 100%;
    margin-top: 1rem;
}

nav {
    background: #24242480;
    height: 3rem;
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 0 5px;
}

.modal-background {
    backdrop-filter: blur(10px);
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    background: #24242480;
    width: 500px;
    border-radius: 2px;
}

.modal h2 {
    margin: 0;
}

.modal .modal-heading {
    border-bottom: 1px solid #444;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
}

.modal form {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem 0;
}

.modal input {
    background: transparent;
    border: 0;
    outline: none !important;
    font-size: 1.2rem;
    border-radius: 2px;
    background: #88888850;
    color: #fff;
    padding: 5px 10px;
    width: 80%;
    height: 40px;
    box-sizing: border-box;
}

.modal input.error {
    border: 2px #ff4b4b solid;
}

.modal .error-text {
    width: calc(80% + 40px);
    margin: 0 auto;
    margin-top: 1rem;
    margin-bottom: -1rem;
}

.modal button {
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
    font-size: 1.5rem;
}

.dashboard {
    display: flex;
    position: absolute;
    width: 100%;
    height: calc(100% - 3rem);
    overflow-y: hidden;
}

* {
    user-select: none;
}

.category {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    color: white;
    width: 100%;
    border-radius: 2px;
    cursor: pointer;
    box-sizing: border-box;
}

.category .name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 4px;
}

p.empty-prompt {
    font-size: 2rem;
    line-height: 2.5rem;
    position: absolute;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
}

.category-heading,
.modal-heading {
    font-family: "Josefin Sans", sans-serif;
}

.category:hover {
    background: #666;
}

.category.selected {
    background: #00a38d;
}

p {
    margin: 0;
}

.side-pane {
    width: 15rem;
    height: 100%;
    background: #24242480;
    font-family: "Josefin Sans", sans-serif;
    padding: 0.3rem 0;
}

.taskview-outer {
    flex-grow: 1;
    flex-shrink: 100;
    overflow-y: auto;
}

.taskview-inner {
    width: 80%;
    margin: 0 auto;
    padding-top: 2rem;
}

.task {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
}

.task button,
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

nav button:first-of-type {
    font-size: 1.5rem;
}

.task button {
    min-width: 80px;
    font-size: 1rem;
}

.task button:hover {
    padding-right: 24px;
    padding-left: 8px;
}

.task button:hover:after {
    opacity: 1;
    right: 10px;
}

.task button:after {
    content: "\00BB";
    position: absolute;
    opacity: 0;
    font-size: 20px;
    line-height: 40px;
    top: 0;
    right: -20px;
    transition: 0.4s;
}

.task .task-text {
    padding: 0 1rem;
    font-size: 1.2rem;
}

.no-tasks {
    font-weight: 400;
}
</style>
