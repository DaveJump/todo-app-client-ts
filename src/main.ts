import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import API from './api'

import {
  Toast,
  Field,
  Button,
  Cell,
  CellGroup,
  Popup,
  NavBar,
  Icon,
  List,
  PullRefresh,
  SwipeCell,
  Picker,
  Tab,
  Tabs,
  Checkbox,
  CheckboxGroup,
  Search,
  Dialog,
  Tabbar,
  TabbarItem
} from 'vant'

import '@/assets/iconfont/iconfont.css'
import '@/assets/sass/public.scss'

Vue.use(Toast)
Vue.use(Field)
Vue.use(Button)
Vue.use(Cell).use(CellGroup)
Vue.use(Popup)
Vue.use(NavBar)
Vue.use(Icon)
Vue.use(List)
Vue.use(PullRefresh)
Vue.use(SwipeCell)
Vue.use(Picker)
Vue.use(Tab).use(Tabs)
Vue.use(Checkbox).use(CheckboxGroup)
Vue.use(Search)
Vue.use(Dialog)
Vue.use(Tabbar).use(TabbarItem)

Vue.config.productionTip = false

Vue.prototype.$axios = () => axios.create()

Vue.prototype.$API = API

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
