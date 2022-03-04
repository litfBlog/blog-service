/**
 * @Author: 微信团队
 * @Date: 2022-03-03 20:01:42
 * @LastEditTime: 2022-03-03 20:07:05
 * @LastEditors: litfa
 * @Description: 加密数据解密算法
 * @FilePath: /blog-service/src/utils/wx/WXBizDataCrypt.js
 * @DocUrl: https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#%E5%8A%A0%E5%AF%86%E6%95%B0%E6%8D%AE%E8%A7%A3%E5%AF%86%E7%AE%97%E6%B3%95
 * @
 */
let crypto = require('crypto')

function WXBizDataCrypt (appId, sessionKey) {
  this.appId = appId
  this.sessionKey = sessionKey
}

WXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
  // base64 decode
  let sessionKey = new Buffer.from(this.sessionKey, 'base64')
  encryptedData = new Buffer.from(encryptedData, 'base64')
  iv = new Buffer.from(iv, 'base64')
  let decoded
  try {
    // 解密
    let decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')

    decoded = JSON.parse(decoded)

  } catch (err) {
    throw new Error('Illegal Buffer')
  }

  if (decoded.watermark.appid !== this.appId) {
    throw new Error('Illegal Buffer')
  }

  return decoded
}

module.exports = WXBizDataCrypt
