<template>
  <div class="login-field">
    <div class="login-field__title">
      <h1>Todo App</h1>
    </div>
    <div class="login-field__fields">
      <van-cell-group>
        <van-field
          v-model="form.username"
          clearable
          label="用户名"
          placeholder="输入用户名"
          @input="handleInputChange"
          :error-message="errorMessages.username"
        />
        <van-field
          v-model="form.password"
          type="password"
          clearable
          label="密码"
          placeholder="输入密码"
          @input="handleInputChange"
          :error-message="errorMessages.password"
        />
      </van-cell-group>
    </div>
    <div class="buttons">
      <van-button type="primary" size="large" @click="handleLogin">登 录</van-button>
    </div>
    <div class="login-field__footer">
      <span @click="registerVisible = true">注册新用户</span>
    </div>

    <!-- 注册新用户 -->
    <register v-model="registerVisible"></register>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import register from './register.vue'
import JSEncrypt from 'jsencrypt'
import { RSA_PUBLIC_KEY, userInfoName, cookieTokenName } from '@/config'
import { usersAPI } from '@/api'
import { setCookie } from '@/utils'
import ValidateSchema from 'async-validator'
import mixin from '@/mixins'
import { UserInfo } from './vars'

const descriptor = {
  username: { required: true, message: '请输入用户名' },
  password: { required: true, message: '请输入密码' }
}

interface Form {
  [index: string]: string,
  username: string,
  password: string
}

interface ErrorMessages {
  username: string,
  password: string
}

@Component({
  name: 'Login',
  components: {
    register
  }
})
class Login extends Mixins(mixin) {
  form: Form = {
    username: '',
    password: ''
  }
  registerVisible = false
  errorMessages: ErrorMessages = {
    username: '',
    password: ''
  }
  validator = new ValidateSchema(descriptor)

  // methods
  async handleLogin () {
    this.handleValidate()
      .then(async () => {
        try {
          let encrypt = new JSEncrypt()
          encrypt.setPublicKey(RSA_PUBLIC_KEY)
          let password = encrypt.encrypt(this.form.password)

          this.$toast({
            type: 'loading',
            duration: 0,
            forbidClick: true
          })
          await usersAPI.login({
            data: {
              username: this.form.username,
              password
            }
          })
          // let { username, token, expiresIn } = results

          // let userInfo: UserInfo = {
          //   username
          // }
          // setCookie(cookieTokenName, token, expiresIn)
          // setCookie(userInfoName, JSON.stringify(userInfo), expiresIn)
          setTimeout(() => {
            this.$router.push({ path: '/' })
          }, 100)
          this.$toast.clear()
        } catch (e) {
          console.error(e)
        }
      })
  }
}

export default Login
</script>

<style lang="scss" scoped>
.login-field{
  @extend %single-page-common;
  padding-top: 0;
  &__title{
    padding: 30px 0 25px 0;
    font-size: 30px;
    text-align: center;
  }
  &__footer{
    margin: 15px 0;
    text-align: center;
    > span{
      color: $linkColor;
    }
  }
}
</style>
