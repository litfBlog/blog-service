/*
 * @Author: litfa
 * @Date: 2022-03-09 11:33:33
 * @LastEditTime: 2022-03-30 18:14:55
 * @LastEditors: litfa
 * @Description: 初始化文章
 * @FilePath: /blog-service/src/router/articles/init.ts
 * 
 */
import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import query from '../../db/query'
import { mkdirSync } from 'fs'
import { join } from 'path'
import config from './../../config'
const router = Router()
router.post('/add', async (req, res) => {
  const uuid = uuidv4()
  const user = req.user as any
  let err, results
  // 验证唯一性 作者和uuid不能重复
  [err, results] = await query('select * from articlesqueue where ? and ? or ? and ?', [
    { author: user.id },
    { status: 1 },
    { uuid },
    { status: 1 }

  ])
  console.log(err, results)

  if (results?.length >= 1) {
    return res.send({
      status: 5,
      ...results[0]
    })
  }
  // 创建资源目录
  try {
    mkdirSync(join(config.tempFileDir, uuid))
  } catch (e) {
    console.log(e)
    return res.send({ statue: 5 })
  }
  // 插入队列
  [err, results] = await query('insert into articlesqueue set ?', {
    uuid,
    author: user.id,
    type: 'add',
    status: 1
    // 标题、内容等省略
  })
  console.log(err, results)

  // 执行 SQL 语句 失败 || 成功 但是影响行数不等于 1
  if (err || results.affectedRows !== 1) return res.send({ statue: 5 })

  res.send({ status: 1, uuid })
})

// 编辑文章初始化时不需要修改数据库，只需提供数据
router.post('/edit', async (req, res) => {
  const { id } = req.body
  if (!id) return res.send({ status: 4 })
  const user = req.user as any
  const [err, results] = await query('select * from articles where ? and ?', [
    { author: user.id },
    { id }
  ])
  if (err) return res.send({ status: 5 })

  res.send({ status: 1, ...results[0] })
})

export default router