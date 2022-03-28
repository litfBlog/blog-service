/*
 * @Author: litfa
 * @Date: 2022-03-11 14:50:51
 * @LastEditTime: 2022-03-28 14:34:38
 * @LastEditors: litfa
 * @Description: 发布文章
 * @FilePath: /blog-service/src/router/articles/push.ts
 * 
 */
import { Router } from 'express'
import config from './../../config'
import query from '../../db/query'
const router = Router()

router.post('/', async (req, res) => {
  // 发布时先调用保存， 发布时使用保存的内容
  const { title, uuid, content, contenttype, cover } = req.body
  // uuid错误
  if (!uuid) return res.send({ status: 4 })
  const user = req.user as any
  // 获取队列
  let err, results
  [err, results] = await query('select * from articlesqueue where ? and ? and ?', [{ uuid }, { author: user.id }, { status: 1 }])
  if (results?.length < 1) {
    return res.send({ status: 4, msg: '未找到文章' })
  }
  // 验证文章信息

  // 发布的文章
  if (results[0].type == 'add') {
    [err, results] = await query('insert into articles set ?', {
      type: results[0].contenttype,
      uuid,
      author: user.id,
      title: results[0].title,
      content: results[0].content,
      cover: results[0].cover,
      status: 0,
      createDate: Date.now(),
      desc: results[0].desc
    })
    if (err) return res.send({ status: 5 })
    await query('update articlesqueue set ? where ? and ?', [{ status: 3 }, { uuid }, { author: user.id }])
    console.log(results, err)

    if (!err) return res.send({ status: 1, id: results.insertId })
  } else if (results[0].type == 'edit') {
    // 修改文章
    // 
  }
  // const { err, results } = await query('update articlesqueue set ? where ? and ?', [
  //   {
  //     title: title || '',
  //     content: content || '',
  //     contenttype,
  //     cover: cover || ''
  //   },
  //   // uuid和作者匹配
  //   { uuid },
  //   { author: user.id }
  // ])

  // if (err) return res.send({ status: 5 })
  // res.send({ status: 1 })
})

export default router