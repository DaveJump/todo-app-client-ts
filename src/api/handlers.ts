import axios from 'axios'
import { queryString } from '../utils'
import { Toast } from 'vant'
import { Obj } from '../modules/interfaces'
import { getCookie } from '@/utils'
import { cookieTokenName } from '@/config'

const Axios = axios.create({
  baseURL: '/api',
  timeout: 20000,
  responseType: 'json'
})

// 用户登录和注册不需要带token
// @TODO 业务API需不需要耦合进来？考虑可扩展性。待优化
const tokenExcludes = /auth\/?.*/

// 请求拦截，设置Authorization
// @TODO 可用axios实例覆盖
Axios.interceptors.request.use(
  config => {
    let url = config.url || ''

    if (!tokenExcludes.test(url)) {
      let token = getCookie(cookieTokenName)
      config.headers.Authorization = `Bearer ${token}`
    }
    delete config.headers.cookie
    return config
  }
)

// 响应拦截
// @TODO 可用axios实例覆盖
Axios.interceptors.response.use(
  response => {
    let results = response.data.results || {}
    return results
  },
  error => {
    Toast({
      message: error.response.data.error,
      position: 'bottom',
      duration: 1500
    })
    return Promise.reject(error.response)
  }
)

const dataInConfigMethods: string[] = ['delete', 'head', 'options']
const axiosFetch = (method: string, url: string, data: Obj, options: object) => {
  method = method.toLowerCase()

  let fetchUrl: string = method === 'get' ? `${url}?${queryString.stringify(data)}` : url

  if (method === 'get') {
    return Axios.get(fetchUrl, options)
  } else if (dataInConfigMethods.includes(method)) {
    return (Axios as any)[method](fetchUrl, { data, ...options })
  }
  return (Axios as any)[method](fetchUrl, data, options)
}

export default axiosFetch
