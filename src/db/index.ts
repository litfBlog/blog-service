/*
 * @Author: litfa
 * @Date: 2022-03-01 11:41:42
 * @LastEditTime: 2022-05-02 17:50:32
 * @LastEditors: litfa
 * @Description: mysql
 * @FilePath: /blog-service/src/db/index.ts
 * 
 */
import mysql from 'mysql'
import config from '../config'

const { host, user, password, database, port } = config.mysql

const db = mysql.createPool({
  host,
  port,
  user,
  password,
  database
})

export default db