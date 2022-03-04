/*
 * @Author: litfa
 * @Date: 2022-03-04 15:20:56
 * @LastEditTime: 2022-03-04 15:57:15
 * @LastEditors: litfa
 * @Description: sql
 * @FilePath: /blog-service/src/db/query.ts
 * 
 */
import db from './index'
interface res {
  // eslint-disable-next-line
  err?: any
  // eslint-disable-next-line
  results?: any
}
// eslint-disable-next-line
export default (sql: string, values: any = '') => {
  return new Promise<res>((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      resolve({ err, results })
    })
  })
}