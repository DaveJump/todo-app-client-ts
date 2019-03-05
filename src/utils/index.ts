import { Obj } from '../modules/interfaces'

export const queryString = {
  stringify (obj: Obj): string {
    return Object.keys(obj).reduce((concated, next) => (
      `${concated}${next}=${obj[next]}&`
    ), '').slice(0, -1)
  },
  parse (str: string): Obj {
    let obj: Obj = {}
    if (str) {
      str.split('&').forEach(item => {
        let key = item.split('=')[0]
        let val = item.split('=')[1]
        obj[key] = val
      })
    }
    return obj
  }
}

export const setCookie = function (key: string, value: any, expSecs: number | string = 0) {
  let oDate = new Date()
  oDate.setTime(oDate.getTime() + Number(expSecs) * 1000)
  document.cookie = `${key}=${escape(value)}${expSecs ? `;expires=${oDate.toUTCString()}` : ''}`
}

export const removeCookie = function (key: string) {
  setCookie(key, '', -1)
}

export const getCookie = function (key: string): string | void {
  let cookieArr = document.cookie.split('; ')
  for (let i = 0; i < cookieArr.length; i++) {
    let arr = cookieArr[i].split('=')
    if (arr[0] === key) {
      return unescape(arr[1])
    }
  }
}

export default {
  queryString,
  setCookie,
  removeCookie,
  getCookie
}
