/*
 * @Author: litfa
 * @Date: 2022-03-01 11:41:42
 * @LastEditTime: 2022-03-02 17:32:59
 * @LastEditors: litfa
 * @Description: mysql
 * @FilePath: /blog-service/src/db/index.ts
 * 
 */
import mysql from 'mysql'

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'blog'
})

export default db