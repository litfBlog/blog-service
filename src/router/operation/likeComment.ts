/*
 * @Author: litfa
 * @Date: 2022-04-12 16:27:30
 * @LastEditTime: 2022-04-12 16:46:13
 * @LastEditors: litfa
 * @Description: 点赞评论
 * @FilePath: /blog-service/src/router/operation/likeComment.ts
 * 
 */
import query from './../../db/query'
import { Router } from 'express'
const router = Router()

router.post('/', async (req, res) => {
  const { id, like = true, commentId } = req.body
  if (id == undefined || commentId == undefined) {
    return res.send({ status: 4 })
  }
  const user = req.user as any
  let err, results
  [err, results] = await query('select * from comment_likes where ? and ? and ?', [
    { articles_id: id },
    { user_id: user.id },
    { comment_id: commentId }
  ])

  if (err) return res.send({ status: 5, liked: -1 })
  // 用户之前点赞过
  if (results.length >= 1) {
    [err, results] = await query('update comment_likes set ? where ? and ? and ?', [
      {
        like: like,
        last_date: Date.now()
      },
      { articles_id: id },
      { user_id: user.id },
      { comment_id: commentId }
    ])

    if (err) return res.send({ status: 5, liked: -1 })
    res.send({ status: 1, liked: like })
    return
  }

  [err] = await query('insert into comment_likes set ?', {
    user_id: user.id,
    articles_id: id,
    comment_id: commentId,
    date: Date.now().toString(),
    last_date: Date.now(),
    like: like,
    // 用户信息 后面再完善
    user_agent: '',
    user_ip: ''
  })

  if (err) return res.send({ status: 5, liked: -1 })
  res.send({ status: 1, liked: like })
})

router.post('/unLike', (req, res) => {
  // 
})

export default router
