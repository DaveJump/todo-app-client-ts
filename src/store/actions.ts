export default {
  actions: {
    changeEditState ({ commit }: any, val: boolean) {
      commit('CHANGE_EDIT_STATE', val)
    },
    changeSelected ({ commit }: any, val: []) {
      commit('CHANGE_SELECTED', val)
    }
  }
}
