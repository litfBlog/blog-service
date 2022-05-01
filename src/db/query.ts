/*
 * @Author: litfa
 * @Date: 2022-03-04 15:20:56
 * @LastEditTime: 2022-04-26 19:20:38
 * @LastEditors: litfa
 * @Description: sql
 * @FilePath: /blog-service/src/db/query.ts
 * 
 */
import { logger } from '../utils/log'
import db from './index'
// eslint-disable-next-line
export default (sql: string, values: any = '') => {
  return new Promise<any>((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) {
        logger.error('数据库报错', err)
      }
      resolve([err, results])
    })
  })
}