<template>
  <div class="todo-index">
    <van-nav-bar
      title="我的待办"
      fixed>
      <template v-if="!editing">
        <van-icon name="wap-nav" slot="left" size="18px" @click="menuVisible = true" />
        <span slot="right">
          <van-icon name="edit" size="18px" style="margin-right: 15px;" @click="handleChangeEditState" />
          <van-icon name="add-o" size="18px" @click="addTodoVisible = true" />
        </span>
      </template>
      <template v-else>
        <span class="nav-text" @click="handleChangeEditState" slot="left">取消</span>
        <span class="nav-text" :class="{'disabled': !selectedTodos.length}" slot="right">
          <span style="margin-right: 15px;" @click="handleBatchDone">完成</span>
          <span @click="handleBatchDelete">删除</span>
        </span>
      </template>
    </van-nav-bar>
    <todo-list :editing="editing" ref="todoList"></todo-list>
    <add-todo v-model="addTodoVisible" @added="handleTodoAdded"></add-todo>
    <todo-menu :visible.sync="menuVisible"></todo-menu>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import todoList from './todos/list.vue'
import addTodo from './todos/add.vue'
import todoMenu from './users/menu.vue'
import { selectedListType } from './todos/vars'

@Component({
  name: 'todoIndex',
  components: {
    todoList,
    addTodo,
    todoMenu
  }
})
class todoIndex extends Vue {
  addTodoVisible: boolean = false
  editing: boolean = false
  menuVisible: boolean = false
  $refs!: {
    todoList: todoList
  }

  @Watch('storedEditState')
  onStoredEditStateChange (val: boolean) {
    this.editing = val
  }

  // computed
  get selectedTodos (): selectedListType {
    return this.$store.state.selectedTodos
  }
  get storedEditState (): boolean {
    return this.$store.state.editing
  }

  // methods
  handleTodoAdded () {
    this.$refs.todoList.handleRefreshList()
  }
  handleChangeEditState () {
    this.editing = !this.editing
    this.$store.dispatch('changeEditState', this.editing)
  }
  handleBatchDone () {
    if (this.selectedTodos.length) {
      this.$refs.todoList.batchOperate('update')
    }
  }
  handleBatchDelete () {
    if (this.selectedTodos.length) {
      this.$refs.todoList.batchOperate('delete')
    }
  }
}

export default todoIndex
</script>

<style lang="scss" scoped>
.add-todo-button{
  font-size: 20px;
  margin-bottom: 4px;
}
</style>
