/*
 * @Author: litfa
 * @Date: 2022-03-11 14:28:50
 * @LastEditTime: 2022-04-22 18:46:52
 * @LastEditors: litfa
 * @Description: 保存草稿
 * @FilePath: /blog-service/src/router/articles/v2/save.ts
 * 
 */
import { Router } from 'express'
import config from '../../../config'
import query from '../../../db/query'
const router = Router()

router.post('/', async (req, res) => {
  const { id, title, content, cover, desc } = req.body
  const user = req.user as any
  const [err, results] = await query('update saved_articles set ? where author=? and status=? and id=? OR author=? and status=? and id=? ', [
    {
      title: title || '',
      content: content || '',
      cover: cover || '',
      desc: desc || '',
      last_edit_date: Date.now()
    },
    // uuid和作者匹配
    user.id, 0, id,
    // or
    user.id, 2, id
  ])

  if (err) return res.send({ status: 5 })
  res.send({ status: 1 })
})

export default router
