<template>
  <div class="todo-main">
    <van-nav-bar
      title="待办"
      fixed>
      <template v-if="!editing">
        <van-icon slot="left" name="edit" size="18px" style="margin-right: 15px;" @click="handleChangeEditState" />
        <van-icon slot="right" name="add-o" size="18px" @click="handleAddTodo" />
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
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import todoList from './list.vue'
import addTodo from './add.vue'
import { selectedListType } from './vars'

@Component({
  name: 'TodoMain',
  components: {
    todoList,
    addTodo
  }
})
class TodoMain extends Vue {
  editing: boolean = false
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
  handleAddTodo () {
    this.$router.push({ name: 'todoDetail', path: '/todo', params: { todoId: '0' } })
  }
}

export default TodoMain
</script>

<style lang="scss" scoped>
.add-todo-button{
  font-size: 20px;
  margin-bottom: 4px;
}
</style>
