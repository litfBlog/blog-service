/*
 * @Author: litfa
 * @Date: 2022-04-22 17:45:28
 * @LastEditTime: 2022-04-25 18:41:33
 * @LastEditors: litfa
 * @Description: 初始化文章
 * @FilePath: /blog-service/src/router/articles/init.ts
 * 
 */
import { Router } from 'express'
import query from '../../db/query'
import config from '../../config'
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

  res.send({
    status: 1, data: {
      id: results.insertId
    }
  })
})

// 编辑文章初始化时 创建保存，且需提供数据
router.post('/edit', async (req, res) => {
  const { id } = req.body
  if (!id) return res.send({ status: 4 })
  const user = req.user as any
  // 查询队列
  let err, results
  [err, results] = await query('select * from saved_articles where ? and ? and ?', [
    { author: user.id },
    { status: 2 },
    { articles_id: id }
  ])
  // 查询到队列 直接返回
  if (results?.length >= 1) {

    return res.send({ status: 1, data: results[0] })
  }
  // 获取文章
  [err, results] = await query('select * from articles where ? and ?', [
    { author: user.id },
    { id }
  ])
  if (err) return res.send({ status: 5 })
  if (results?.length < 1) return res.send({ status: 4 })

  // 插入队列
  const [insertErr, insert] = await query('insert into saved_articles set ?', {
    title: results[0].title,
    content: results[0].content,
    cover: results[0].cover,
    desc: results[0].desc,
    status: 2,
    author: user.id,
    create_date: Date.now(),
    articles_id: results[0].id
  })

  // 执行 SQL 语句 失败 || 成功 但是影响行数不等于 1
  if (insertErr || insert.affectedRows !== 1) return res.send({ status: 5 })

  res.send({ status: 1, data: results[0] })
})

export default router