/*
 * @Author: litfa
 * @Date: 2022-03-22 10:43:53
 * @LastEditTime: 2022-04-24 17:56:23
 * @LastEditors: litfa
 * @Description: 获取单个文章
 * @FilePath: /blog-service/src/router/articles/getOne.ts
 * 
 */
import query from '../../db/query'
import { Router } from 'express'
import markdown from './../../utils/markdown'
import htmlAddClass from '../../utils/htmlAddClass'
const router = Router()

const sql = `
SELECT
    articles.id,
    articles.title,
    articles.content,
    articles.cover,
    articles.status,
    articles.author,
    articles.create_date,
    articles.desc,
    author.avatar,
    author.username,
    COUNT(DISTINCT likes.id, likes.like) AS likes_count,
    IF(is_liked.\`like\`=1, 1, '0') AS liked
FROM
    \`articles\` AS articles
LEFT JOIN \`likes\` likes ON articles.id = likes.articles_id AND likes.like=1
LEFT JOIN \`users\` author ON articles.\`author\` = author.\`id\`
LEFT JOIN likes is_liked ON is_liked.\`articles_id\` = articles.\`id\` AND is_liked.\`user_id\` = ?
WHERE articles.id=? AND articles.status=1
GROUP BY articles.id
ORDER BY articles.create_date DESC
LIMIT 0, 100
`

// 未登录用户
router.post('/:id', async (req, res) => {
  const { id } = req.params
  const [err, results] = await query(sql, [0, id])
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, data: results[0] })
})

// 登录用户 包含是否点赞等字段
router.post('/detailed/:id', async (req, res) => {
  const { id } = req.params
  const user = req.user as any
  if (!user.id) return res.send({ status: 4 })
  const [err, results] = await query(sql, [user.id, id])
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, data: results[0] })

})

// 获取解析后的html 由微信小程序调用
router.post('/getWXML/:id', async (req, res) => {
  const { id } = req.params
  const [err, results] = await query(sql, [0, id])
  if (err) return res.send({ status: 5 })

  if (results.length < 1) {
    return res.send({ status: 4 })
  }

  let content = results[0].content
  content = markdown(content)
  content = htmlAddClass(content)
  results[0].content = content

  res.send({ status: 1, data: results[0] })
})

export default router