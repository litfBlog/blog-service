/*
 * @Author: litfa
 * @Date: 2022-03-07 09:18:21
 * @LastEditTime: 2022-03-07 09:32:25
 * @LastEditors: litfa
 * @Description: 生成token
 * @FilePath: /blog-service/src/utils/token.ts
 * 
 */

import jwt from 'jsonwebtoken'
import config from './../config'
export default (data: object) => {
  // 在服务器端直接拼接上 Bearer 的前缀
  return 'Bearer ' + jwt.sign(data, config.jwtSecretKey, {
    // expiresIn: '10h' // token 有效期为 10 个小时
    // 这里单位是秒 不是毫秒！
    // 直接用 10d 表示10天
    expiresIn: '10d' 
  })
}
