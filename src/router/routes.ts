const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      keepAlive: true
    },
    component: () => import('../views/index.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    meta: {
      keepAlive: true
    },
    component: () => import('../views/settings/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/users/login.vue')
  }
]

export default routes
