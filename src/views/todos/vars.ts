export interface Category {
  id: number,
  value: string,
  label?: string
}

export interface Todo {
  _id: string | number,
  todoStatus: number,
  todoName: string,
  desc: string,
  createTime: any
}

export type selectedListType = Array<Todo | number | string>

export const categories: Category[] = [
  {
    id: 0,
    value: 'unclassified',
    label: '未分级'
  },
  {
    id: 1,
    value: 'normal',
    label: '一般'
  },
  {
    id: 2,
    value: 'delay',
    label: '延期'
  },
  {
    id: 3,
    value: 'urgent',
    label: '紧急'
  }
]

export default {
  categories
}
