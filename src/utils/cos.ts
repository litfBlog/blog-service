/*
 * @Author: litfa
 * @Date: 2022-04-19 16:58:09
 * @LastEditTime: 2022-04-19 17:00:25
 * @LastEditors: litfa
 * @Description: 对象存储
 * @FilePath: /blog-service/src/utils/cos.ts
 * 
 */

// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
import COS from 'cos-nodejs-sdk-v5'
import config from './../config'
const cos = new COS({
  SecretId: config.SecretId,
  SecretKey: config.SecretKey
})

export default cos