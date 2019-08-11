const express = require('express')
const router = express.Router();
const util = require('../../utils/util')
const {
    unifiedOrder,
    signToPayData
} = require('../../common/common')
const {
    mp
} = require('../../common/config')


router.get('/pay', async (req, res) => {
    //传递不同参数
    let appid = mp.appId
    let body = '支付测试'
    let out_trade_no = util.getOutTradeNo()
    let openid = req.query.openid
    let total_fee = 1
    let notify_url = 'http://localhost:80'
    let trade_type = 'JSAPI'
    //调取统一下单接口获取prepay_id
    const prepay_id = await unifiedOrder(appid, body, out_trade_no, openid, total_fee, notify_url, trade_type)
    console.log(prepay_id)
    // 再次签名获取singSign
    const payData = signToPayData(mp.appId, prepay_id)

    res.json(util.getSuc(payData));
})


module.exports = router;