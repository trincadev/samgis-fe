import Callback from "@/views/Callback.vue";
import Home from "@/views/Home.vue";
import { authGuard } from "@auth0/auth0-vue";
import { createRouter, createWebHistory } from "vue-router";

const NotFound = () => import("@/views/NotFound.vue");
const Profile = () => import("@/views/Profile.vue");
const PredictionMap = () => import("@/views/PredictionMap.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/prediction-map",
    name: "map with machine learning",
    component: PredictionMap,
    beforeEnter: authGuard,
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    beforeEnter: authGuard,
  },
  {
    path: "/callback",
    name: "callback",
    component: Callback,
  },
  {
    path: "/:catchAll(.*)",
    name: "Not Found",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
