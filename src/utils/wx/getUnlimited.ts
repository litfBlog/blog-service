/*
 * @Author: litfa
 * @Date: 2022-03-01 20:29:40
 * @LastEditTime: 2022-03-08 10:04:56
 * @LastEditors: litfa
 * @Description: 获取小程序码 getUnlimited
 * @FilePath: /blog-service/src/utils/wx/getUnlimited.ts
 * 
 */
import axios from 'axios'
// import config from 'src/config'
import getAccessToken from './getAccessToken'
export default async (code: string) => {
  // https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html
  const { data: res } = await axios({
    method: 'POST',
    url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
    responseType: 'arraybuffer',
    data: {
      scene: code,
      page: 'subpkg/login/login',
      // 测试环境（小程序上线前不检查）上线后修改
      env_version: 'develop',
      check_path: false
    },
    params: {
      access_token: await getAccessToken()
    }
  })

  return res
}