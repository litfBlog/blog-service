/*
 * @Author: litfa
 * @Date: 2022-03-22 10:43:53
 * @LastEditTime: 2022-04-02 19:55:41
 * @LastEditors: litfa
 * @Description: 获取单个文章
 * @FilePath: /blog-service/src/router/articles/getOne.ts
 * 
 */
import query from './../../db/query'
import { Router } from 'express'
const router = Router()

const sql = `
SELECT
    articles.id,
    articles.type,
    articles.uuid,
    articles.title,
    articles.content,
    articles.cover,
    articles.status,
    articles.author,
    articles.createDate,
    articles.desc,
    author.avatar,
    author.username,
    COUNT(DISTINCT likes.id, likes.like) AS likes_count,
    is_liked.\`user_id\` AS liked
FROM
    \`articles\` AS articles
LEFT JOIN \`likes\` likes ON articles.id = likes.articles_id AND likes.like=1
LEFT JOIN \`users\` author ON articles.\`author\` = author.\`id\`
LEFT JOIN \`likes\` is_liked ON articles.id = likes.articles_id AND is_liked.\`user_id\` = 1
WHERE articles.id=? AND articles.status=0
GROUP BY articles.id
ORDER BY articles.createDate DESC
LIMIT 0, 100
`

router.post('/:id', async (req, res) => {
  const { id } = req.params
  const [err, results] = await query(sql, id)
  console.log(err)

  if (err) return res.send({ status: 5 })
  res.send({ status: 1, data: results[0] })
})

export default router