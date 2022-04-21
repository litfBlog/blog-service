/*
 * @Author: litfa
 * @Date: 2022-04-09 18:21:11
 * @LastEditTime: 2022-04-21 14:26:53
 * @LastEditors: litfa
 * @Description: 友链
 * @FilePath: /blog-service/src/router/operation/friendLink.ts
 * 
 */
import { Router } from 'express'
import query from './../../db/query'
import rules from './../../config/rules/friendLink'
const router = Router()

router.all('/getHomeLink', async (req, res) => {
  const [err, results] = await query('SELECT * FROM friend_links')
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, data: results })
})

router.all('/getAllLink', async (req, res) => {
  const [err, results] = await query('SELECT * FROM friend_links')
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, data: results })
})

router.post('/add', async (req, res) => {
  const { name, url, desc, icon } = req.body
  if (rules.validate(req.body).error) {
    return res.send({ status: 4 })
  }
  const user = req.user as any
  const [err, results] = await query('INSERT INTO friend_links SET ? ', {
    url,
    name,
    desc,
    icon,
    user_id: user.id,
    date: Date.now(),
    status: 0,
    view_in_home: false
  })
  console.log(err)

  if (err) return res.send({ status: 5 })
  res.send({ status: 1 })
})

export default router