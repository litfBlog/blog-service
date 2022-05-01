/*
 * @Author: litfa
 * @Date: 2022-03-01 11:41:42
 * @LastEditTime: 2022-04-27 20:13:38
 * @LastEditors: litfa
 * @Description: mysql
 * @FilePath: /blog-service/src/db/index.ts
 * 
 */
import mysql from 'mysql'
import config from '../config'

const { host, user, password, database } = config.mysql

const db = mysql.createPool({
  host: host,
  user: user,
  password: password,
  database: database
})

export default db