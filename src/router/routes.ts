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
    path: '/todo/:todoId',
    name: 'todoDetail',
    meta: {
      keepAlive: true
    },
    component: () => import('../views/todos/add.vue')
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
    path: '/settings/change-pwd',
    name: 'changePwd',
    component: () => import('../views/settings/change-pwd.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/users/login.vue')
  }
]

export default routes
