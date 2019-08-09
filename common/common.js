const request = require('./request')
const {
  wx
} = require('./config')
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
  }
}