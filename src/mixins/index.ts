import { Component, Vue, Watch } from 'vue-property-decorator'
import { debounce } from 'lodash'

@Component
class Mixin extends Vue {
  validator: any
  form: any
  errorMessages: any

  @Watch('$route')
  handleRouteChange () {
    setTimeout(() => {
      this.resetForm()
      this.resetErrorMessages()
    }, 200)
  }

  handleValidate () {
    return new Promise((resolve, reject) => {
      this.validator.validate(
        {
          ...this.form
        },
        (errors: any) => {
          if (errors) {
            let errorFields = errors.map((err: any) => err.field)

            Object.keys(this.form).forEach(key => {
              if (errorFields.includes(key)) {
                this.errorMessages[key] = errors.find((err: any) => err.field === key).message
              } else {
                this.errorMessages[key] = ''
              }
            })
            reject(errors)
            return
          }
          for (let key in this.errorMessages) {
            this.errorMessages[key] = ''
          }
          resolve()
        }
      )
    })
  }
  handleInputChange = debounce(this.handleValidate, 400)
  resetForm () {
    for (let key in this.form) {
      this.form[key] = ''
    }
  }
  resetErrorMessages () {
    for (let key in this.errorMessages) {
      this.errorMessages[key] = ''
    }
  }
}
export default Mixin
