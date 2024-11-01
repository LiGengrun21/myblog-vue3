import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // router pattern
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      alias: ['/']
    },
    {
      path: '/register',
      name: 'register',
      component: ()=>import('../views/RegisterView.vue')
    },
    {
      path: '/detail/:id',
      name: 'blogDetail',
      props: true,
      component: ()=>import('../views/BlogDetailView.vue')
    },
    {
      path: '/createPost',
      name: 'createPost',
      component: ()=>import("../views/CreatePostView.vue")
    },
  ]
})

export default router
