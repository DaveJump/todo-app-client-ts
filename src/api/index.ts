import axiosFetch from './handlers'
import { FetchParams } from '../modules/interfaces'

const apiPrefix = '/api'

const fetch = (method: string, url: string) => {
  return ({ data = {}, options = {} }: FetchParams) => axiosFetch(method, url, data, options)
}

export const usersAPI = {
  // 用户注册
  register: fetch('POST', `${apiPrefix}/auth`),
  // 用户登录
  login: fetch('PUT', `${apiPrefix}/auth`)
}

interface TodosAPI {
  [index: string]: (obj: FetchParams) => {}
}

export const todosAPI: TodosAPI = {
  // 获取todos
  getTodos ({ data, params, options }: FetchParams) {
    let { category } = params
    return fetch('GET', `${apiPrefix}/categories/${category}/todos`)({ data, options })
  },
  // 新增todo
  addTodo ({ data, params, options }: FetchParams) {
    let { category } = params
    return fetch('POST', `${apiPrefix}/categories/${category}/todos`)({ data, options })
  },
  // 批量修改todos
  updateTodos: fetch('PUT', `${apiPrefix}/todos`),
  // 批量删除todos
  deleteTodos: fetch('DELETE', `${apiPrefix}/todos`)
}
