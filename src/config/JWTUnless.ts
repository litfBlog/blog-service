/*
 * @Author: litfa
 * @Date: 2022-03-15 10:31:02
 * @LastEditTime: 2022-04-03 17:43:58
 * @LastEditors: litfa
 * @Description: tokek 无需认证
 * @FilePath: /blog-service/src/config/JWTUnless.ts
 * 
 */
import config from './../config'
export default [
  new RegExp(`^${config.baseUrl}/login/`),
  new RegExp(`^${config.baseUrl}/articles/get/`),
  /^\/static\//,
  new RegExp(`${config.baseUrl}/articles/getOne/[0-9]`)
]