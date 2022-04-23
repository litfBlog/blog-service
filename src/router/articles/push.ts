/*
 * @Author: litfa
 * @Date: 2022-03-11 14:50:51
 * @LastEditTime: 2022-04-23 12:34:31
 * @LastEditors: litfa
 * @Description: 发布文章
 * @FilePath: /blog-service/src/router/articles/push.ts
 * 
 */
import { Router } from 'express'
import config from '../../config'
import query from '../../db/query'
import schema from '../../config/rules/articles'
const router = Router()

router.post('/', async (req, res) => {
  // 发布时先调用保存， 发布时使用保存的内容
  const { title, id, content, desc, cover } = req.body
  // 未传入id
  if (id === undefined) return res.send({ status: 4 })
  const user = req.user as any
  // 获取草稿
  let err, results
  [err, results] = await query('select * from saved_articles where ? and ? and ? OR ? and ? and ?', [
    { id },
    { author: user.id },
    { status: 0 },
    // or
    { id },
    { author: user.id },
    { status: 2 }
  ])
  if (err) return res.send({ status: 5 })
  if (results?.length < 1) {
    return res.send({ status: 4, msg: '未找到草稿' })
  }

  // 验证文章信息
  if (schema.validate(req.body).error) {
    return res.send({ status: 5, msg: '请正确填写表单' })
  }

  // 修改与新增 数据不同
  // 共同部分数据
  const data: any = {
    title,
    content,
    cover,
    desc
  }
  // 插入的数据
  const insert: any = {
    ...data,
    create_Date: Date.now(),
    status: 1,
    author: user.id
  }
  // 更新的数据包
  const update: any = {
    ...data,
    last_edit_date: Date.now(),
    status: 3,
    articles_id: results[0].status.articles_id
  }

  if (results[0].status == 0) {
    // 插入新文章
    [err] = await query('insert into articles set ?', insert)
    if (err) return res.send({ status: 5 })
    // 修改原数据库状态
    const [editErr] = await query('update saved_articles set ? where ?', [{
      status: 1
    }, {
      // 前面的id没问题 这里直接用
      id
    }])
    if (editErr) return res.send({ status: 5 })
  } else if (results[0].status == 2) {
    // 更新文章
    [err, results] = await query('update articles set ? where ?', [
      update,
      { id: results[0].status.articles_id }
    ])
    if (err) return res.send({ status: 5 })
    // 修改原数据库状态
    const [editErr] = await query('update saved_articles set ? where ?', [{
      status: 1
    }, {
      // 前面的id没问题 这里直接用
      id
    }])
    if (editErr) return res.send({ status: 5 })
  }

  res.send({ status: 1 })
})

export default router