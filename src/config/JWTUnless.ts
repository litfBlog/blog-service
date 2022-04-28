/*
 * @Author: litfa
 * @Date: 2022-03-15 10:31:02
 * @LastEditTime: 2022-04-28 16:35:36
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
  new RegExp(`${config.baseUrl}/articles/getOne/[0-9]`),
  new RegExp(`^${config.baseUrl}/articles/getLiks`),
  new RegExp(`^${config.baseUrl}/articles/getOne/getWXML/`),
  new RegExp(`^${config.baseUrl}/friendLink/getHomeLink`),
  new RegExp(`^${config.baseUrl}/articles/getComment/getCounts`),
  new RegExp(`^${config.baseUrl}/articles/getComment/getCounts`),
  new RegExp(`^${config.baseUrl}/articles/getComment/getList`)
]