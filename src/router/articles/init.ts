/*
 * @Author: litfa
 * @Date: 2022-03-09 11:33:33
 * @LastEditTime: 2022-03-30 19:08:22
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
  [err, results] = await query('select * from articlesqueue where ? and ? and ? or ? and ?', [
    { author: user.id },
    { status: 1 },
    { type: 'add' },
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
  if (err || results.affectedRows !== 1) return res.send({ status: 5 })

  res.send({ status: 1, uuid })
})

// 编辑文章初始化时 创建队列，且需提供数据 但不需创建目录
router.post('/edit', async (req, res) => {
  const { id } = req.body
  if (!id) return res.send({ status: 4 })
  const user = req.user as any
  // 查询队列
  let err, results
  [err, results] = await query('select * from articlesqueue where ? and ? and ?', [
    { author: user.id },
    { status: 1 },
    { articlesid: id }
  ])
  // 查询到队列 直接返回
  if (results?.length >= 1) {
    console.log(results)

    return res.send({ status: 1, ...results[0] })
  }
  // 获取文章
  [err, results] = await query('select * from articles where ? and ?', [
    { author: user.id },
    { id }
  ])
  if (err) return res.send({ status: 5 })
  if (results?.length < 1) return res.send({ status: 4 })

  // // 插入队列
  const [insertErr, insert] = await query('insert into articlesqueue set ?', {
    author: user.id,
    articlesid: results[0].id,
    uuid: results[0].uuid,
    type: 'edit',
    title: results[0].title,
    content: results[0].content,
    contenttype: results[0].type,
    cover: results[0].cover,
    status: 1,
    desc: results[0].desc
  })
  // console.log(err, results)

  // 执行 SQL 语句 失败 || 成功 但是影响行数不等于 1
  if (insertErr || insert.affectedRows !== 1) return res.send({ status: 5 })

  res.send({ ...results[0], status: 1 })
})

export default router