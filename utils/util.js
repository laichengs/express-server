const request = require('request')
const {
  createHash
} = require('crypto')
module.exports = {
  /**
   * author laicheng
   * descrition 获取accessToken
   *  */
  getAccessToken() {

  },

  getSuc(data) {
    return {
      code: 0,
      data,
      msg: ''
    }
  },

  getFail(msg, code = 50000) {
    return {
      code,
      msg,
      data: ''
    }
  },

  createNonceStr() {
    return Math.random().toString(32).substr(2)
  },

  createTimeStamp() {
    return parseInt(Date.now() / 1000)
  },

  getSignature(obj) {
    const keys = Object.keys(obj).sort()
    let newObj = {}
    keys.forEach(item => {
      newObj[item] = obj[item]
    })
    let str = ''
    for (let i in newObj) {
      str += `&${i}=${newObj[i]}`
    }
    return createHash("sha1").update(str.substr(1)).digest('hex')
  }
}