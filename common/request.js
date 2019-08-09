const request = require('request');
const util = require("../utils/util")
module.exports = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        resolve(util.getSuc(JSON.parse(body)))
      } else {
        reject('http失败')
      }
    })
  })
}