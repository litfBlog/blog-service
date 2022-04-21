/*
 * @Author: litfa
 * @Date: 2022-04-21 15:55:52
 * @LastEditTime: 2022-04-21 15:59:43
 * @LastEditors: litfa
 * @Description: 友链
 * @FilePath: /blog-service/src/router/admin/audit/friend.ts
 * 
 */
import { Router } from 'express'
import query from './../../../db/query'
const router = Router()

router.post('/get', async (req, res) => {
  const [err, results] = await query('SELECT * FROM friend_links WHERE status=?', 0)
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, data: results })
})

export default router