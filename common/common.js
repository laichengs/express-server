const request = require('./request')
const original_request = require('request')
const xml2js = require('xml2js')
const {
  wx,
  mch
} = require('./config')
const util = require('../utils/util')
module.exports = {
  // 获取网页授权的AccessToken
  getAccessToken(code) {
    let access_token_url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${wx.appId}&secret=${wx.appSecret
  }&code=${code}&grant_type=authorization_code`
    return request(access_token_url)
  },

  //获取用户信息
  getUserInfo(access_token, openid) {
    let user_info_url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
    return request(user_info_url)
  },

  //获取token
  getToken() {
    let tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wx.appId}&secret=${wx.appSecret}`
    return request(tokenUrl)
  },

  //获取jsapi_ticket
  getTicket(token) {
    let ticketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`
    return request(ticketUrl)
  },

  //微信统一下单接口
  unifiedOrder(appid, body, out_trade_no, openid, total_fee, notify_url, trade_type) {
    return new Promise((resolve, reject) => {
      let unifiedUrl = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
      const data = util.getSendData(appid, body, out_trade_no, openid, total_fee, notify_url, trade_type);
      original_request.post({
        url: unifiedUrl,
        form: data
      }, (error, response, body) => {
        //因为返回数据为xml格式的，所以需要xml2js进行转义
        xml2js.parseString(body, (err, result) => {
          console.log(JSON.stringify(result))
          console.log(result.xml)
          const {
            return_code,
            result_code,
            prepay_id
          } = result.xml
          if (return_code[0] == "SUCCESS" && result_code[0] == "SUCCESS") {
            console.log(prepay_id[0])
            resolve(prepay_id[0]);
          }
        })
      })
    })
  },

  //小程序再次签名
  signToPayData(appid, prepay_id) {
    const params = {
      appId: appid,
      timeStamp: util.createTimeStamp(),
      nonceStr: util.createNonceStr(),
      package: 'prepay_id=' + prepay_id,
      signType: 'MD5'
    }
    params.paySign = util.getSignByPay(params);
    return params;
  }
}