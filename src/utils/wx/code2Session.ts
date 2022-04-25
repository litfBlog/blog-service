/*
 * @Author: litfa
 * @Date: 2022-03-03 18:34:20
 * @LastEditTime: 2022-04-25 18:41:34
 * @LastEditors: litfa
 * @Description: 登录凭证校验
 * @FilePath: /blog-service/src/utils/wx/code2Session.ts
 * 
 */
import axios from 'axios'
import config from './../../config'
import getAccessToken from './getAccessToken'
/**
 * @description: 登录凭证校验
 * @param {string} code
 * @return {string} session_key openid
 */
export default async (code: string) => {
  // https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
  const { data: res } = await axios({
    method: 'GET',
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    params: {
      appid: config.wx.appid,
      secret: config.wx.secret,
      js_code: code,
      grant_type: 'authorization_code'
    }
  })

  return res
}