/*
 * @Author: litfa
 * @Date: 2022-04-04 19:19:40
 * @LastEditTime: 2022-04-05 13:51:11
 * @LastEditors: litfa
 * @Description: 发送评论
 * @FilePath: /blog-service/src/router/operation/sendComment.ts
 * 
 */
import { Router } from 'express'
import query from './../..//db/query'
const router = Router()

router.post('/add', async (req, res) => {
  const { content, id, parent = 0 } = req.body
  // parent 父级评论的id 用于回复评论 默认为0 直接发送评论
  const user = req.user as any
  const [err, results] = await query('INSERT INTO `comment` SET ?', {
    user_id: user.id,
    articles_id: id,
    content: content,
    status: 1,
    parent
  })
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, content_id: results.insertId })
})

export default router