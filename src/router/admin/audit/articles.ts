/*
 * @Author: litfa
 * @Date: 2022-04-23 15:54:33
 * @LastEditTime: 2022-04-23 16:47:53
 * @LastEditors: litfa
 * @Description: 文章审核
 * @FilePath: /blog-service/src/router/admin/audit/articles.ts
 * 
 */
import { Router } from 'express'
import query from './../../../db/query'
const router = Router()

const sql = `
SELECT
    articles.id,
    articles.title,
    articles.cover,
    articles.status,
    articles.author,
    articles.create_date,
    articles.desc,
    author.avatar,
    author.username,
    COUNT(DISTINCT likes.id, likes.like) AS likes_count,
    COUNT(DISTINCT comments.id) AS comment_count,
    is_liked.\`user_id\` AS liked
FROM
    \`articles\` AS articles
LEFT JOIN \`likes\` likes ON articles.id = likes.articles_id AND likes.like=1
LEFT JOIN \`users\` author ON articles.\`author\` = author.\`id\`
LEFT JOIN \`likes\` is_liked ON articles.id = likes.articles_id AND is_liked.\`user_id\` = 1
LEFT JOIN \`comment\` comments ON articles.id = comments.\`articles_id\`
WHERE ?
GROUP BY articles.id
ORDER BY articles.create_date DESC
`
router.post('/get', async (req, res) => {
  const [err, results] = await query(sql, {
    'articles.status': 0
  })

  if (err) return res.send({ status: 5 })
  res.send({ status: 1, data: results })
})

router.post('/set', async (req, res) => {
  const { accept, id }: { accept: boolean, id: number } = req.body
  if (accept == undefined || id == undefined) return res.send({ status: 4 })
  let err, results
  if (accept) {
    // accept
    [err, results] = await query('UPDATE `articles` SET ? WHERE ?', [{ status: 1 }, { id }])
  } else {
    // deny
    [err, results] = await query('UPDATE `articles` SET ? WHERE ?', [{ status: 5 }, { id }])
  }
  if (err) return res.send({ status: 5 })
  res.send({ status: 1 })
})

export default router