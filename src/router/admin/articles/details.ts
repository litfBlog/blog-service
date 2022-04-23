/*
 * @Author: litfa
 * @Date: 2022-04-10 19:28:00
 * @LastEditTime: 2022-04-23 16:19:34
 * @LastEditors: litfa
 * @Description: 获取文章详情
 * @FilePath: /blog-service/src/router/admin/articles/details.ts
 * 
 */
import query from './../../../db/query'
import { Router } from 'express'
const router = Router()

const sql = `
SELECT
    articles.*,
    author.*,
    articles.id as id,
    author.id as author_id,
    author.status as author_status,
    COUNT(DISTINCT likes.id, likes.like) AS likes_count,
    IF(is_liked.\`like\`=1, 1, '0') AS liked
FROM
    \`articles\` AS articles
LEFT JOIN \`likes\` likes ON articles.id = likes.articles_id AND likes.like=1
LEFT JOIN \`users\` author ON articles.\`author\` = author.\`id\`
LEFT JOIN likes is_liked ON is_liked.\`articles_id\` = articles.\`id\` AND is_liked.\`user_id\` = ?
WHERE articles.id=?
GROUP BY articles.id
ORDER BY articles.create_date DESC
`
router.post('/', async (req, res) => {
  const { id } = req.body
  const [err, results] = await query(sql, [0, id])
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, data: results })
})

export default router