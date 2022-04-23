/*
 * @Author: litfa
 * @Date: 2022-04-19 17:01:59
 * @LastEditTime: 2022-04-20 16:57:46
 * @LastEditors: litfa
 * @Description: cos上传对象
 * @FilePath: /blog-service/src/utils/putObject.ts
 * 
 */
import cos from './cos'
import config from './../config'

export default (filename: string, buffer: Buffer) => {
  return new Promise((resolve, reject) => {
    cos.putObject({
      Bucket: config.Bucket, /* 必须 */
      Region: config.Region,    /* 必须 */
      Key: filename,              /* 必须 */
      Body: buffer
    }, function (err, data) {
      resolve(data)
    })
  })
}