// Composables
import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/Signup.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/ForgotPassword.vue'),
  },
  {
    path: '/reset-password/:token',
    name: 'reset-password',
    component: () => import('@/views/ResetPassword.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/Profile.vue'),
  },
  {
    path: '/game/:id',
    name: 'game',
    component: () => import('@/views/Game.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/Admin.vue')
  },
  {
    path: '/admin/:id',
    name: 'edit-game',
    component: () => import('@/views/EditGame.vue')
  },
  {
    path: '/admin/new',
    name: 'new-game',
    component: () => import('@/views/NewGame.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL || '/'),
  routes,
})

router.beforeEach(async (to, from) => {
  let authenticated = localStorage.getItem("authorized");

  if (authenticated) {
    if (
      to.name === 'login' ||
      to.name === 'signup' ||
      to.name === 'reset-password' ||
      to.name === 'forgot-password'
    ) {
      return {name: 'home'}
    }
  } else {
    if (to.name === 'profile' || to.name === 'game') {
      return {name: 'login'}
    }
  }
})
export default router
