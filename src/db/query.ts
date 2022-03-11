/*
 * @Author: litfa
 * @Date: 2022-03-04 15:20:56
 * @LastEditTime: 2022-03-11 16:00:02
 * @LastEditors: litfa
 * @Description: sql
 * @FilePath: /blog-service/src/db/query.ts
 * 
 */
import db from './index'
// eslint-disable-next-line
export default (sql: string, values: any = '') => {
  return new Promise<any>((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      // resolve({ err, results })
      resolve([err, results])
    })
  })
}