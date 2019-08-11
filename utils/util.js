const request = require('request')
const {
  createHash
} = require('crypto')
const {
  mch
} = require("../common/config")
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
    return parseInt(Date.now() / 1000).toString()
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
  },

  //获取微信支付签名
  getSignByPay(obj) {
    const keys = Object.keys(obj).sort()
    let newObj = {}
    keys.forEach(item => {
      newObj[item] = obj[item]
    })
    let str = ''
    for (let item in newObj) {
      str += "&" + item + "=" + newObj[item]
    }
    let signStr = str.substr(1) + "&key=" + mch.api_key
    console.log("sssss" + signStr)
    return createHash('md5').update(signStr).digest('hex').toUpperCase()
  },

  //获取发送的xml数据
  getSendData(appid, body, out_trade_no, openid, total_fee, notify_url, trade_type) {
    let mch_id = mch.mch_id
    let nonce_str = this.createNonceStr();
    let spbill_create_ip = "116.25.147.154";
    let params = {
      appid,
      mch_id,
      nonce_str,
      body,
      out_trade_no,
      openid,
      total_fee,
      notify_url,
      spbill_create_ip,
      trade_type
    }
    let sign = this.getSignByPay(params);
    let data = "<xml>" +
      "<appid>" + appid + "</appid>" +
      "<body>" + body + "</body>" +
      "<mch_id>" + mch_id + "</mch_id>" +
      "<notify_url>" + notify_url + "</notify_url>" +
      "<nonce_str>" + nonce_str + "</nonce_str>" +
      "<openid>" + openid + "</openid>" +
      "<out_trade_no>" + out_trade_no + "</out_trade_no>" +
      "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>" +
      "<total_fee>" + total_fee + "</total_fee>" +
      "<trade_type>" + trade_type + "</trade_type>" +
      "<sign>" + sign + "</sign>" +
      "</xml>"
    console.log(data)
    return data;
  },

  //创建订单号
  getOutTradeNo(type = 'wx') {
    let time = Date.now().toString()
    let text = ''
    let tmp = "abcdefghio"
    let len = tmp.length;
    for (let i = 0; i < len; i++) {
      text += tmp.charAt(Math.random() * 10 - 1)
    }
    return type == "wx" ? 'WX' + (time + text).toUpperCase() : "MP" + (time + text).toUpperCase()
  }
}