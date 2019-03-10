import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from '../store'
import { getCookie } from '@/utils'
import { cookieTokenName } from '@/config'

Vue.use(Router)

const router = new Router({
  routes
})

// 跳转前检查用户登录状态
router.beforeEach((to, from, next) => {
  let cookieToken = getCookie(cookieTokenName)
  let path = to.path

  if (path !== '/login') {
    cookieToken ? next() : next({ path: '/login' })
  } else {
    next()
  }

  // next()
})

// 路由前进后退动画
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') || 0 * 1
history.setItem('/', '0')

router.afterEach((to, from) => {
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('UPDATE_DIRECTION', 'forward')
    } else {
      store.commit('UPDATE_DIRECTION', 'backward')
    }
  } else {
    historyCount = Number(historyCount) + 1
    history.setItem('count', `${historyCount}`)
    to.path !== '/' && history.setItem(to.path, `${historyCount}`)
    store.commit('UPDATE_DIRECTION', 'forward')
  }
})

export default router
