<template>
  <div class="add-todo">
    <van-nav-bar :title="todoId ? '代办详情' : '新增代办'" fixed left-arrow @click-left="handleBack">
      <van-icon slot="right" name="edit" size="18px" v-if="formReadonly" @click="formReadonly = false" />
      <span class="nav-text" slot="right" v-if="!formReadonly && todoId" @click="formReadonly = true">取消</span>
    </van-nav-bar>

    <div class="fields">
      <van-cell-group>
        <van-field
          :readonly="formReadonly"
          label="标题"
          placeholder="输入待办标题"
          clearable
          v-model="form.todoName"
          @input="handleInputChange"
          :error-message="errorMessages.todoName"/>
        <van-field
          :readonly="formReadonly"
          label="描述"
          placeholder="输入待办描述"
          clearable
          v-model="form.desc"
          @input="handleInputChange"
          type="textarea"
          autosize
          rows="3"
          :error-message="errorMessages.desc"/>
        <van-cell
          @click="toggleCategory"
          title="级别"
          :is-link="!formReadonly"
          :value="getCategoryPropValue('label')"/>
      </van-cell-group>
    </div>
    <div class="buttons" v-if="!formReadonly">
      <van-button type="primary" size="large" @click="handleAddTodo">{{todoId ? '修改' : '新增'}}</van-button>
    </div>

    <category
      v-model="claVisible"
      :default-value="form.claValue"
      @change="handleSetCla">
    </category>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Emit, Mixins } from 'vue-property-decorator'
import category from './category.vue'
import { categories, Category } from './vars'
import { todosAPI } from '@/api'
import mixin from '@/mixins'
import ValidateSchema from 'async-validator'
import { Obj } from '@/modules/interfaces'

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
class AddTodo extends Mixins(mixin) {
  formReadonly: boolean = true
  form: Form = {
    todoName: '',
    desc: '',
    claValue: 'unclassified'
  }
  errorMessages: ErrorMessages = {
    todoName: '',
    desc: ''
  }
  claVisible = false
  validator = new ValidateSchema(descriptor)

  get todoId (): string | null {
    let id = this.$route.params.todoId
    return id === '0' ? null : id
  }

  @Watch('$route.path', { immediate: true })
  handleRouteParamsChange (val: string) {
    this.$nextTick(() => {
      if (this.todoId) {
        this.formReadonly = true
        this.getTodoById()
      } else {
        this.formReadonly = false
        this.resetForm()
      }
    })
  }

  // methods
  getCategoryPropValue (prop = 'label'): number | string {
    let option = categories.find(cla => cla.value === this.form.claValue)
    return option ? option[prop] : ''
  }
  mapCategoryValue (mapProp = 'id', mapValue: number | string = '', getProp = 'value') {
    let option = categories.find(cla => cla[mapProp] === mapValue)
    return option ? option[getProp] : ''
  }
  handleAddTodo () {
    this.handleValidate()
      .then(async () => {
        try {
          this.$toast({
            type: 'loading',
            forbidClick: true,
            duration: 0
          })
          let { todoName, desc } = this.form
          let method = this.todoId ? 'updateTodos' : 'addTodo'
          let payload
          if (this.todoId) {
            payload = {
              data: {
                todos: [this.todoId],
                set: { todoName, desc, category: this.getCategoryPropValue('id') }
              }
            }
          } else {
            payload = {
              data: {
                todoName,
                desc
              },
              params: {
                category: this.getCategoryPropValue('id')
              }
            }
          }
          await todosAPI[method](payload)
          this.$toast({
            type: 'success',
            message: '新增成功'
          })
          setTimeout(() => {
            this.handleBack()
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
  handleBack () {
    this.$router.back()
  }
  toggleCategory () {
    if (!this.formReadonly) {
      this.claVisible = true
    }
  }
  async getTodoById () {
    try {
      this.$toast({
        type: 'loading',
        forbidClick: true,
        duration: 0
      })
      let res: Obj = await todosAPI.getTodoById({
        data: { todo_id: this.todoId }
      })
      let { todoName, desc, category } = res.data.results
      this.form.todoName = todoName
      this.form.desc = desc
      this.form.claValue = this.mapCategoryValue('id', +category, 'value')
    } catch (e) {
      console.error(e)
    } finally {
      this.$toast.clear()
    }
  }
}

export default AddTodo
</script>

<style lang="scss" scoped>
.add-todo{
  @extend %single-page-common;
}
</style>
