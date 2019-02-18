interface State {
  editing: boolean,
  selectedTodos: Array<object | number | string>,
  direction: string
}

const state: State = {
  editing: false,
  selectedTodos: [],
  direction: ''
}

export default {
  state
}
