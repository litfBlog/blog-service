/*
 * @Author: litfa
 * @Date: 2022-04-21 15:55:52
 * @LastEditTime: 2022-04-21 17:30:37
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

router.post('/set', async (req, res) => {
  const { accept, id }: { accept: boolean, id: number } = req.body
  if (accept == undefined || id == undefined) return res.send({ status: 4 })
  let err, results
  if (accept) {
    // accept
    [err, results] = await query('UPDATE `friend_links` SET ? WHERE ?', [{ status: 1 }, { id }])
  } else {
    // deny
    [err, results] = await query('UPDATE `friend_links` SET ? WHERE ?', [{ status: 2 }, { id }])
  }
  if (err) return res.send({ status: 5 })
  res.send({ status: 1 })
})

export default router