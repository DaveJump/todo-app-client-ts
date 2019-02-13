import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import { getCookie } from '@/utils'

Vue.use(Router)

const router = new Router({
  routes
})

// 跳转前检查用户登录状态
router.beforeEach((to, from, next) => {
  let cookieToken = getCookie('todoAppUserToken')
  let toToken = to.query.token
  let path = to.path

  if (path !== '/login') {
    if (toToken) {
      next()
    } else {
      !cookieToken ? next({ path: '/login' }) : next({ path, query: { token: cookieToken } })
    }
  } else {
    next()
  }
  // next()
})

export default router
