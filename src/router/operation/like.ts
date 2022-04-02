/*
 * @Author: litfa
 * @Date: 2022-04-02 16:32:45
 * @LastEditTime: 2022-04-02 17:06:07
 * @LastEditors: litfa
 * @Description: 点赞文章
 * @FilePath: /blog-service/src/router/operation/like.ts
 * 
 */
import query from './../../db/query'
import { Router } from 'express'
const router = Router()

router.post('/', async (req, res) => {
  const { id, like = true } = req.body
  const user = req.user as any
  let err, results
  [err, results] = await query('select * from likes where ? and ?', [
    { articles_id: id },
    { user_id: user.id }
  ])
  if (err) return res.send({ status: 5, liked: -1 })
  // 用户之前点赞过
  if (results.length >= 1) {
    [err, results] = await query('update likes set ? where ? and ?', [
      {
        like: like,
        last_date: Date.now()
      },
      { articles_id: id },
      { user_id: user.id }
    ])

    if (err) return res.send({ status: 5, liked: -1 })
    res.send({ status: 1, liked: like })
    return
  }

  [err] = await query('insert into likes set ?', {
    user_id: user.id,
    articles_id: id,
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

export default router