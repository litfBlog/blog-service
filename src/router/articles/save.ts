/*
 * @Author: litfa
 * @Date: 2022-03-11 14:28:50
 * @LastEditTime: 2022-03-28 14:27:02
 * @LastEditors: litfa
 * @Description: 保存草稿
 * @FilePath: /blog-service/src/router/articles/save.ts
 * 
 */
import { Router } from 'express'
import config from './../../config'
import query from '../../db/query'
const router = Router()

router.post('/', async (req, res) => {
  const { title, uuid, content, contenttype, cover, desc } = req.body
  // uuid错误
  if (!uuid) return res.send({ status: 4 })
  const user = req.user as any
  // let err, results
  const [err, results] = await query('update articlesqueue set ? where ? and ?', [
    {
      title: title || '',
      content: content || '',
      contenttype,
      cover: cover || '',
      desc: desc || ''
    },
    // uuid和作者匹配
    { uuid },
    { author: user.id }
  ])

  if (err) return res.send({ status: 5 })
  res.send({ status: 1 })
})

export default router