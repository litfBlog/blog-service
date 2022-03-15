/*
 * @Author: litfa
 * @Date: 2022-03-15 10:31:02
 * @LastEditTime: 2022-03-15 10:36:45
 * @LastEditors: litfa
 * @Description: tokek 无需认证
 * @FilePath: /blog-service/src/config/JWTUnless.ts
 * 
 */
import config from './../config'
export default [
  new RegExp(`^${config.baseUrl}/login/`),
  new RegExp(`^${config.baseUrl}/articles/get/home`)
]