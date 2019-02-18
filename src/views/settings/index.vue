<template>
  <div class="settings">
    <van-nav-bar title="设置" fixed left-arrow @click-left="handleBack"></van-nav-bar>

    <div class="block">
      <span class="block__title">账户</span>
      <van-cell-group>
        <van-cell title="修改密码" is-link @click="redirectTo('change-pwd')" />
      </van-cell-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
class Settings extends Vue {
  handleBack () {
    this.$router.back()
  }
  redirectTo (path: string) {
    this.$router.push({ path: `/settings/${path}` })
  }
}

export default Settings
</script>

<style scoped lang="scss">
.settings{
  @extend %single-page-common;
}
</style>
