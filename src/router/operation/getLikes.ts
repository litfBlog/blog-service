/*
 * @Author: litfa
 * @Date: 2022-04-07 17:06:19
 * @LastEditTime: 2022-04-23 12:41:11
 * @LastEditors: litfa
 * @Description: 获取点赞的文章
 * @FilePath: /blog-service/src/router/operation/getLikes.ts
 * 
 */
import query from './../../db/query'
import { Router } from 'express'
const router = Router()

const sql = `
SELECT  
likes.*,
articles.id,
articles.title,
articles.cover,
articles.status,
articles.author,
articles.create_date,
articles.desc
FROM 
\`likes\` AS likes
LEFT JOIN \`articles\` articles ON articles.\`id\` = likes.\`articles_id\`
WHERE likes.\`user_id\` = ?
LIMIT ?, ?
`
router.post('/', async (req, res) => {
  const { limit = 30, offset = 0, id } = req.body
  if (id == undefined) return res.send({ status: 4 })
  // 查询数据库
  const [err, results] = await query(sql, [id, offset, limit])
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, data: results })
})

export default router