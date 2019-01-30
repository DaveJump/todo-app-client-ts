<template>
  <van-popup v-model="menuVisible" position="left" class="todo-menu">
    <div class="todo-menu__user-info van-hairline--bottom">
      <van-icon name="user-circle-o user-info__portrait"></van-icon>
      <p>{{userName}}</p>
    </div>
    <div class="todo-menu__nav-list">
      <van-cell title="设置" icon="setting-o" is-link></van-cell>
    </div>
  </van-popup>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'

@Component({
  name: 'todoMenu'
})
class TodoMenu extends Vue {
  menuVisible = false
  userName = '未登录'

  @Prop({ default: false }) visible!: boolean

  @Watch('visible')
  onVisibleChange (val: boolean) {
    this.menuVisible = val
  }

  @Watch('menuVisible')
  onMenuVisibleChange (val: boolean) {
    this.menuVisible = val
    this.emitVisible(val)
  }

  @Emit('update:visible')
  emitVisible (val: boolean) {
    return val
  }
}

export default TodoMenu
</script>

<style lang="scss" scoped>
.todo-menu{
  width: 60%;
  height: 100%;
  &__user-info{
    text-align: center;
    color: $subTitleColor;
    padding: 15px 0;
    p {
      margin: 0;
      margin-top: 5px;
    }
  }
  .user-info{
    &__portrait{
      font-size: 50px;
    }
  }
  &__nav-list{
    /deep/ .van-cell{
      padding: 10px;
    }
    /deep/ .van-icon{
      color: $subTitleColor;
      &.van-cell__left-icon{
        font-size: 18px;
      }
    }
  }
}
</style>
