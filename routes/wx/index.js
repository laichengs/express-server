const express = require('express')
const util = require('../../utils/util.js')
const {
  wx
} = require('../../common/config')
const {
  getAccessToken,
  getUserInfo,
  getToken,
  getTicket
} = require('../../common/common')
const cache = require('memory-cache')
const router = express.Router();

router.get('/redirect', (req, res) => {
  cache.put('redirectUrl', req.query.url)
  let callback = encodeURIComponent("http://wx.com/api/wechat/get_code");
  let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wx.appId}&redirect_uri=${callback}&response_type=code&scope=${wx.scope}&state=STATE#wechat_redirect`
  res.redirect(url)
})

router.get('/get_code', async (req, res) => {
  let code = req.query.code;
  if (!code) {
    res.json(util.getFail('获取code失败'))
  }
  // if (!cache.get('access_token')) {
  const result = await getAccessToken(code);
  console.log(result)
  if (result.code == 0) {
    const {
      openid,
      access_token
    } = result.data
    //cookie存入openid
    res.cookie('openId', openid)
    //缓存accessToken
    cache.put('access_token', access_token, 1000 * 60 * 60 * 2);
  }
  // }
  res.redirect(cache.get("redirectUrl"))
})

router.get('/user_info', async (req, res) => {
  let openid = req.query.openid;
  let access_token = cache.get('access_token');
  const result = await getUserInfo(access_token, openid)
  if (result.code == 0) {
    res.json(util.getSuc(result.data));
  }
})

router.get('/jssdk', async (req, res) => {
  //获取url
  const url = req.query.url
  // 获取token
  const result = await getToken();
  if (result.code == 0) {
    const token = result.data.access_token
    cache.put('token', token, 1000 * 60 * 60 * 2)
    // 获取ticket
    const {
      data: {
        ticket
      }
    } = await getTicket(token)
    //列出参数
    const params = {
      noncestr: util.createNonceStr(),
      jsapi_ticket: ticket,
      timestamp: util.createTimeStamp(),
      url
    }
    const sign = util.getSignature(params)
    params.signature = sign;
    params.appId = wx.appId;
    params.jsApiList = [
      'updateAppMessageShareData',
      'updateTimelineShareData',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareQZone',
      'chooseWXPay'
    ] // 必填，需要使用的JS接口列表
    res.json(util.getSuc(params));
  }
})



module.exports = router;