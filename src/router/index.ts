import { createWebHistory, createRouter } from "vue-router";
import Home from "../components/Home.vue";
import About from "../components/About.vue";
import App from "../App.vue";

const routes = [
    {
        path: "/home",
        name: "Home",
        component: App,
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;