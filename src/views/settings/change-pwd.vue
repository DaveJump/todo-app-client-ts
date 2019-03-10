<template>
  <div class="settings__change-pwd">
    <van-nav-bar title="修改密码" fixed left-arrow @click-left="handleBack"></van-nav-bar>

    <div class="fields">
      <van-cell-group>
        <van-field
          v-model="form.oldPassword"
          type="password"
          clearable
          label="旧密码"
          placeholder="输入旧密码"
          @input="handleInputChange"
          :error-message="errorMessages.oldPassword"
        />
        <van-field
          v-model="form.newPassword"
          type="password"
          clearable
          label="新密码"
          placeholder="输入新密码(6-12位)"
          @input="handleInputChange"
          :error-message="errorMessages.newPassword"
        />
        <van-field
          v-model="form.confirmNewPassword"
          type="password"
          clearable
          label="确认新密码"
          placeholder="再次输入新密码"
          @input="handleInputChange"
          :error-message="errorMessages.confirmNewPassword"
        />
      </van-cell-group>
    </div>
    <div class="buttons">
      <van-button type="primary" size="large" @click="handleChangePwd">确 认</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator'
import mixin from '@/mixins'
import ValidateSchema from 'async-validator'
import { usersAPI } from '@/api'
import { RSA_PUBLIC_KEY, cookieTokenName, userInfoName } from '@/config'
import JSEncrypt from 'jsencrypt'
import { removeCookie, getCookie } from '@/utils'

const descriptor = {
  oldPassword: { required: true, message: '请输入旧密码' },
  newPassword: [
    { required: true, message: '请输入新密码' },
    { min: 6, max: 12, message: '密码长度需在6-12之间' }
  ],
  confirmNewPassword: [
    { required: true, message: '请再次输入新密码' },
    {
      validator (rule: any, value: any, callback: any, source: any, options: any) {
        let errors = []
        if (value !== source['newPassword']) {
          errors.push(new Error('密码长度需在6-12之间'))
        }
        callback(errors)
      },
      message: '两次密码不匹配'
    }
  ]
}

interface From {
  [index: string]: string,
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string
}

interface ErrorMessages {
  [index: string]: string,
  oldPassword: string,
  newPassword: string,
  confirmNewPassword: string
}

@Component({
  name: 'ChangePwd'
})
class ChangePwd extends Mixins(mixin) {
  form: From = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  }
  errorMessages: ErrorMessages = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  }
  validator = new ValidateSchema(descriptor)

  handleBack () {
    this.$router.back()
  }
  handleChangePwd () {
    this.handleValidate()
      .then(async () => {
        try {
          let encrypt = new JSEncrypt()
          encrypt.setPublicKey(RSA_PUBLIC_KEY)
          let oldPassword = encrypt.encrypt(this.form.oldPassword)
          let newPassword = encrypt.encrypt(this.form.newPassword)

          this.$toast({
            type: 'loading',
            duration: 0,
            forbidClick: true
          })

          await usersAPI.changePassword({
            data: {
              oldPassword,
              newPassword
            }
          })
          this.$toast({
            type: 'success',
            message: '修改成功，请重新登录'
          })
          this.$router.replace({ path: '/login' })
          removeCookie(cookieTokenName)
          removeCookie(userInfoName)
        } catch (e) {
          console.error(e)
        }
      })
  }
}

export default ChangePwd
</script>

<style lang="scss" scoped>
.settings__change-pwd{
  @extend %single-page-common;
}
</style>
