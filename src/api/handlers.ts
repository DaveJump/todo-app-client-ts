import axios from 'axios'
import { queryString } from '../utils'
import { Toast } from 'vant'
import { Obj } from '../modules/interfaces'

// 设置超时
axios.defaults.timeout = 20000

// 统一错误处理
// @TODO 可用axios实例覆盖
axios.interceptors.response.use(response => {
  return response
}, error => {
  Toast({
    message: error.response.data.error,
    position: 'bottom',
    duration: 1500
  })
  return Promise.reject(error)
})

// 用户登录和注册不需要带token
// @TODO 业务API需不需要耦合进来？考虑可扩展性。待优化
const tokenExcludes = /^\/api\/auth\/?.*/

// 统一为其他请求配上token
const setToken = function (url: string, options: object): object {
  let str: string = window.location.hash.split('?')[1]
  let query: Obj = queryString.parse(str)

  if (!tokenExcludes.test(url)) {
    let { token } = query
    return {
      headers: {
        Authorization: `Bearer ${token}`
      },
      ...options
    }
  }
  return options
}

const dataInConfigMethods: string[] = ['delete', 'head', 'options']
const axiosFetch = (method: string, url: string, data: Obj, options: object) => {
  options = setToken(url, options)
  method = method.toLowerCase()

  let fetchUrl: string = method === 'get' ? `${url}?${queryString.stringify(data)}` : url

  if (method === 'get') {
    return axios.get(fetchUrl, options)
  } else if (dataInConfigMethods.includes(method)) {
    return (axios as any)[method](fetchUrl, { data, ...options })
  }
  return (axios as any)[method](fetchUrl, data, options)
}

export default axiosFetch
