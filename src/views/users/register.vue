<template>
  <div class="register">
    <van-popup
      class="register-popup"
      v-model="visible"
      position="bottom">
      <div class="header">
        <i class="iconfont icon-i-close close-button" @click="handleCloseRegister"></i>
        <span>注册新用户</span>
      </div>
      <div class="fields">
        <van-field
          v-model="form.username"
          clearable
          label="用户名"
          placeholder="输入用户名"
          @input="handleInputChange"
          :error-message="errorMessages.username"
        />
        <van-field
          type="password"
          v-model="form.password"
          clearable
          label="密码"
          placeholder="设置密码(6-12位)"
          @input="handleInputChange"
          :error-message="errorMessages.password"
        />
        <van-field
          type="password"
          v-model="form.confirmPassword"
          clearable
          label="确认密码"
          placeholder="再次输入密码"
          @input="handleInputChange"
          :error-message="errorMessages.confirmPassword"
        />
      </div>
      <div class="buttons">
        <van-button type="primary" size="large" @click="handleRegister">注 册</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Mixins } from 'vue-property-decorator'
import { usersAPI } from '@/api'
import { RSA_PUBLIC_KEY } from '@/config'
import JSEncrypt from 'jsencrypt'
import ValidateSchema from 'async-validator'
import mixin from '@/mixins'

const descriptor = {
  username: { required: true, message: '请输入用户名' },
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, max: 12, message: '密码长度需在6-12之间' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码' },
    {
      validator (rule: any, value: any, callback: any, source: any, options: any) {
        let errors = []
        if (value !== source['password']) {
          errors.push(new Error('密码长度需在6-12之间'))
        }
        callback(errors)
      },
      message: '两次密码不匹配'
    }
  ]
}

interface Form {
  [index: string]: string,
  username: string,
  password: string,
  confirmPassword: string
}

interface ErrorMessages {
  [index: string]: string,
  username: string,
  password: string,
  confirmPassword: string
}

@Component({
  name: 'Register'
})
class Register extends Mixins(mixin) {
  @Prop(Boolean) value!: boolean

  form: Form = {
    username: '',
    password: '',
    confirmPassword: ''
  }
  errorMessages: ErrorMessages = {
    username: '',
    password: '',
    confirmPassword: ''
  }
  visible = false
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
  handleRegister () {
    this.handleValidate()
      .then(async () => {
        try {
        // RSA公钥加密密码
          let encrypt = new JSEncrypt()
          encrypt.setPublicKey(RSA_PUBLIC_KEY)
          let password = encrypt.encrypt(this.form.password)

          this.$toast({
            type: 'loading',
            duration: 0,
            forbidClick: true
          })
          await usersAPI.register({
            data: {
              username: this.form.username,
              password
            }
          })
          this.$toast({
            type: 'success',
            message: '注册成功'
          })
          setTimeout(() => {
            this.handleCloseRegister()
          }, 300)
        } catch (e) {
          console.error(e)
        }
      })
  }
  handleCloseRegister () {
    this.visible = false
    this.resetForm()
    this.resetErrorMessages()
  }
}

export default Register
</script>
