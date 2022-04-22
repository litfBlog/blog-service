/*
 * @Author: litfa
 * @Date: 2022-04-22 17:45:28
 * @LastEditTime: 2022-04-22 18:11:19
 * @LastEditors: litfa
 * @Description: 初始化文章
 * @FilePath: /blog-service/src/router/articles/v2/init.ts
 * 
 */
import { Router } from 'express'
import query from '../../../db/query'
import config from '.././../../config'
const router = Router()
router.post('/add', async (req, res) => {
  const user = req.user as any
  let err, results
  // 查询是否有草稿
  [err, results] = await query('select * from saved_articles where ? and ? ', [
    { author: user.id },
    { status: 0 }
  ])

  if (err) return res.send({ status: 5 })

  // 有草稿 返回草稿
  if (results?.length >= 1) {
    return res.send({
      status: 1,
      data: results[0]
    })
  }

  // 没有草稿 创建
  [err, results] = await query('insert into saved_articles set ?', {
    author: user.id,
    status: 0,
    create_date: Date.now()
  })

  if (err) return res.send({ status: 5 })

  // 执行 SQL 语句 失败 || 成功 但是影响行数不等于 1
  if (err || results.affectedRows !== 1) return res.send({ status: 5 })

  res.send({ status: 1 })
})

export default router