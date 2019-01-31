<template>
  <div class="categories">
    <van-popup
      class="category-popup"
      v-model="visible"
      position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        value-key="label"
        ref="picker"
        @cancel="handleCancel"
        @confirm="handleConfirm">
      </van-picker>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { categories } from './vars'
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'

@Component({
  name: 'categories'
})
class Categories extends Vue {
  @Prop(Boolean) value!: boolean
  @Prop({ type: [String, Number], default: 'unclassified' }) defaultValue!: string | number

  visible = false
  columns = [
    {
      values: categories,
      textAlign: 'center'
    }
  ]
  claValue = this.defaultValue

  // computed
  get defaultSelectIndex (): number {
    let index = categories.findIndex(cla => cla.value === this.defaultValue)
    return index > -1 ? index : 0
  }

  @Watch('value')
  onModelChange (val: boolean) {
    this.visible = val
  }

  @Watch('visible')
  onVisibleChange (val: boolean) {
    this.$emit('input', val)
    this.$nextTick(() => {
      val && this.handleResetValue()
    })
  }

  // methods
  handleResetValue () {
    (this.$refs.picker as any).setColumnIndex(0, this.defaultSelectIndex)
  }
  handleCancel () {
    this.visible = false
  }
  handleConfirm (val: any) {
    this.claValue = val[0].value
    this.$emit('change', this.claValue)
    this.visible = false
  }
}

export default Categories
</script>
