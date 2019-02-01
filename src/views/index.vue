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
        <span class="nav-text" :class="{'disabled': !storedSelectedTodos.length}" slot="right">
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
import { State, Action } from 'vuex-class'
import todoList from './todos/list.vue'
import addTodo from './todos/add.vue'
import todoMenu from './users/menu.vue'
import { selectedListType } from './todos/vars'

@Component({
  name: 'TodoIndex',
  components: {
    todoList,
    addTodo,
    todoMenu
  }
})
class TodoIndex extends Vue {
  addTodoVisible: boolean = false
  editing: boolean = false
  menuVisible: boolean = false
  $refs!: {
    todoList: todoList
  }

  @State('selectedTodos') storedSelectedTodos!: selectedListType
  @State('editing') storedEditState!: boolean

  @Watch('storedEditState')
  onStoredEditStateChange (val: boolean) {
    this.editing = val
  }

  @Action changeEditState!: any
  handleChangeEditState () {
    this.editing = !this.editing
    this.changeEditState(this.editing)
  }
  handleTodoAdded () {
    this.$refs.todoList.handleRefreshList()
  }
  handleBatchDone () {
    if (this.storedSelectedTodos.length) {
      this.$refs.todoList.batchOperate('update')
    }
  }
  handleBatchDelete () {
    if (this.storedSelectedTodos.length) {
      this.$refs.todoList.batchOperate('delete')
    }
  }
}

export default TodoIndex
</script>

<style lang="scss" scoped>
.add-todo-button{
  font-size: 20px;
  margin-bottom: 4px;
}
</style>
