/*
 * @Author: litfa
 * @Date: 2022-04-11 15:19:58
 * @LastEditTime: 2022-04-28 17:41:24
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

router.post('/getOne', async (req, res) => {
  const { id } = req.body
  const [err, results] = await query('SELECT * FROM users WHERE ?', { id })
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, data: results[0] })
})

export default router