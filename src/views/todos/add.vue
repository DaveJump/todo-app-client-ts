<template>
  <div class="add-todo">
    <van-popup
      class="add-todo-popup"
      v-model="visible"
      position="bottom">
      <div class="header">
        <i class="iconfont icon-i-close close-button" @click="handleCloseAddTodo"></i>
        <span>新增待办</span>
      </div>
      <div class="fields">
        <van-cell-group>
          <van-field
            label="标题"
            placeholder="输入待办标题"
            clearable
            v-model="form.todoName"
            @input="handleInputChange"
            :error-message="errorMessages.todoName"
          />
          <van-field
            label="描述"
            placeholder="输入待办描述"
            clearable
            v-model="form.desc"
            @input="handleInputChange"
            type="textarea"
            autosize
            rows="3"
            :error-message="errorMessages.desc"
          />
          <van-cell
            @click="() => { claVisible = true }"
            title="级别"
            is-link
            :value="getClaValue('label')"
          />
        </van-cell-group>
      </div>
      <div class="buttons">
        <van-button type="primary" size="large" @click="handleAddTodo">新 增</van-button>
      </div>
    </van-popup>
    <category
      v-model="claVisible"
      :default-value="form.claValue"
      @change="handleSetCla">
    </category>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Emit } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import category from './category.vue'
import { categories, Category } from './vars'
import { todosAPI } from '@/api'
import mixin from '@/mixins'
import ValidateSchema from 'async-validator'

const descriptor = {
  todoName: { required: true, message: '请输入待办标题' },
  desc: { required: true, message: '请输入待办描述' }
}

interface Form {
  [index: string]: string,
  todoName: string,
  desc: string,
  claValue: string
}

interface ErrorMessages {
  [index: string]: string,
  todoName: string,
  desc: string
}

@Component({
  name: 'AddTodo',
  components: {
    category
  }
})
class AddTodo extends mixins(mixin) {
  @Prop(Boolean) value!: boolean

  form: Form = {
    todoName: '',
    desc: '',
    claValue: 'unclassified'
  }
  errorMessages: ErrorMessages = {
    todoName: '',
    desc: ''
  }
  visible = false
  claVisible = false
  validator = new ValidateSchema(descriptor)

  @Watch('value')
  onModelValueChange (val: boolean) {
    this.visible = val
  }

  @Watch('visible')
  onVisibleChange (val: boolean) {
    this.emitVisibleValue(val)
  }

  @Emit('input')
  emitVisibleValue<T> (val: T): T {
    return val
  }

  // methods
  getClaValue (prop = 'label'): number | string {
    let option = categories.find(cla => cla.value === this.form.claValue)
    return option ? option[prop] : ''
  }
  handleCloseAddTodo () {
    this.visible = false
  }
  handleAddTodo () {
    this.handleValidate(async () => {
      try {
        this.$toast({
          type: 'loading',
          forbidClick: true,
          duration: 0
        })
        let { todoName, desc } = this.form
        await todosAPI.addTodo({
          data: {
            todoName,
            desc
          },
          params: {
            category: this.getClaValue('id')
          }
        })
        this.$toast({
          type: 'success',
          message: '新增成功'
        })
        setTimeout(() => {
          this.visible = false
          this.$emit('added')
        }, 600)
        this.$toast.clear()
      } catch (e) {
        console.error(e)
      }
    })
  }
  handleSetCla (val: string) {
    if (val) {
      this.form.claValue = val
    }
  }
  resetForm () {
    this.form.todoName = ''
    this.form.desc = ''
    this.form.claValue = 'unclassified'
    this.resetErrorMessages()
  }
}

export default AddTodo
</script>
