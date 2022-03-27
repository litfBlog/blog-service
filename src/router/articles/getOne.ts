/*
 * @Author: litfa
 * @Date: 2022-03-22 10:43:53
 * @LastEditTime: 2022-03-23 19:57:57
 * @LastEditors: litfa
 * @Description: 获取单个文章
 * @FilePath: /blog-service/src/router/articles/getOne.ts
 * 
 */
import query from './../../db/query'
import { Router } from 'express'
const router = Router()

router.post('/:id', async (req, res) => {
  const { id } = req.params
  const [err, results] = await query('SELECT a.*,a.*,b.username, b.`avatar` FROM `articles` a JOIN `users` b ON a.`author`=b.id where a.id=? and a.status=0', id)
  console.log(err)

  if (err) return res.send({ status: 5 })
  res.send({ status: 1, data: results[0] })
})

export default router