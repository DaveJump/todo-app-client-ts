interface State {
  editing?: boolean,
  selectedTodos?: Array<object | number | string>
}

const storeState: State = {
  editing: false,
  selectedTodos: []
}

export default storeState
