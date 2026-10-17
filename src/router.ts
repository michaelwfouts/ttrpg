import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import CategoryView from './views/CategoryView.vue'
import DocView from './views/DocView.vue'

// Hash history works on GitHub Pages without a 404.html workaround.
// Swap to createWebHistory(import.meta.env.BASE_URL) if you add one.
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/:category', name: 'category', component: CategoryView, props: true },
    { path: '/:category/:slug', name: 'doc', component: DocView, props: true },
  ],
  // Same-path navigations (e.g. updating ?s= while reading) must not jump to the top.
  scrollBehavior: (to, from) => (to.path === from.path ? false : { top: 0 }),
})
