export default {
  mutations: {
    CHANGE_EDIT_STATE (state: any, val: boolean) {
      state.editing = val
    },
    CHANGE_SELECTED (state: any, val: []) {
      state.selectedTodos = val
    }
  }
}
