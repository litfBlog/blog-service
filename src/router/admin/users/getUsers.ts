/*
 * @Author: litfa
 * @Date: 2022-04-11 15:19:58
 * @LastEditTime: 2022-04-11 16:44:26
 * @LastEditors: litfa
 * @Description: 获取用户列表
 * @FilePath: /blog-service/src/router/admin/users/getUsers.ts
 * 
 */
import query from './../../../db/query'
import { Router } from 'express'
const router = Router()

router.post('/all', async (req, res) => {
  const [err, results] = await query('SELECT * FROM users')
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, list: results })
})

export default router