<template>
  <div class="main-page">
    <todo-main v-show="activeTabbar === 0"></todo-main>
    <profile v-show="activeTabbar === 1"></profile>

    <van-tabbar v-model="activeTabbar">
      <van-tabbar-item icon="todo-list-o">代办</van-tabbar-item>
      <van-tabbar-item icon="user-o">我</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import todoMain from './todos/index.vue'
import profile from './users/profile.vue'

@Component({
  name: 'MainPage',
  components: {
    todoMain,
    profile
  }
})
class MainPage extends Vue {
  activeTabbar: number = 0
}

export default MainPage
</script>

<style lang="scss" scoped>
.main-page{
  @extend %single-page-common;
  padding-top: 0;
}
</style>
