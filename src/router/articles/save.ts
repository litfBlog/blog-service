/*
 * @Author: litfa
 * @Date: 2022-03-11 14:28:50
 * @LastEditTime: 2022-04-23 13:01:01
 * @LastEditors: litfa
 * @Description: 保存草稿
 * @FilePath: /blog-service/src/router/articles/save.ts
 * 
 */
import { Router } from 'express'
import config from '../../config'
import query from '../../db/query'
const router = Router()

router.post('/', async (req, res) => {
  const { id, title, content, cover, desc } = req.body
  if (id == undefined) {
    return res.send({ status: 4 })
  }
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

  // SQL 语句执行成功，但影响行数不为 1
  if (err || results?.affectedRows !== 1) {
    return res.send({ status: 5 })
  }
  res.send({ status: 1 })
})

export default router
