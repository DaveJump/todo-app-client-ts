interface State {
  editing: boolean,
  selectedTodos: Array<object | number | string>
}

const state: State = {
  editing: false,
  selectedTodos: []
}

export default {
  state
}
