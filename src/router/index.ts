import Callback from "@/views/CallbackView.vue";
import Home from "@/views/HomeView.vue";
import { authGuard } from "@auth0/auth0-vue";
import { createRouter, createWebHistory } from "vue-router";

const NotFound = () => import("@/views/NotFoundView.vue");
const Profile = () => import("@/views/ProfileView.vue");
const PredictionMap = () => import("@/views/PredictionMapView.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/blog",
    name: "my blog and website",
    beforeEnter: () => {
      window.location.href = `${import.meta.env.VITE_BLOG_DOMAIN}`
    },
  },
  {
    path: "/docs",
    name: "SamGIS docs",
    beforeEnter: () => {
      window.location.href = `${import.meta.env.VITE_DOCS_SAMGIS_DOMAIN}`
    },
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
