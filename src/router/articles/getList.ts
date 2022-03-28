/*
 * @Author: litfa
 * @Date: 2022-03-14 20:19:23
 * @LastEditTime: 2022-03-28 15:45:39
 * @LastEditors: litfa
 * @Description: 首页文章
 * @FilePath: /blog-service/src/router/articles/getList.ts
 * 
 */
import query from './../../db/query'
import { Router } from 'express'
const router = Router()

// 首页
router.all('/home', async (req, res) => {
  // 可选参数 : limit : 返回数量 , 默认为 30 offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
  const { limit = 30, offset = 0 } = req.body || req.query
  const [err, results] = await query('SELECT a.*,a.*,b.username, b.`avatar` FROM `articles` a JOIN `users` b ON a.`author`=b.id ORDER BY a.createDate desc LIMIT ?,?', [offset, limit])
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, list: results })
})

export default router