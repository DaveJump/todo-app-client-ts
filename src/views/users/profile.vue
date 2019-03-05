<template>
  <div class="profile">
    <div class="profile__user-info van-hairline--bottom">
      <van-icon name="user-circle-o user-info__portrait"></van-icon>
      <p>{{userName}}</p>
    </div>
    <div class="profile__nav-list">
      <van-cell title="设置" icon="setting-o" is-link @click="redirectTo('settings')"></van-cell>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getCookie } from '@/utils'
import { UserInfo } from './vars'

@Component({
  name: 'Profile'
})
class Profile extends Vue {
  reserveUserName = '未登录'
  userName = ''

  getUsernameFromCookie (): string {
    let infoCookie = getCookie('todoAppUserInfo')
    let userInfo = infoCookie ? JSON.parse(infoCookie) : {}
    let { username = this.reserveUserName } = userInfo as UserInfo
    return username
  }
  redirectTo (pageName: string) {
    let query = this.$route.query
    this.$router.push({ path: `/${pageName}`, query })
  }

  mounted () {
    this.userName = this.getUsernameFromCookie()
  }
}

export default Profile
</script>

<style lang="scss" scoped>
.profile{
  &__user-info{
    text-align: center;
    color: $subTitleColor;
    padding: 15px 0;
    margin-bottom: 10px;
    background-color: #fff;
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
}
</style>
