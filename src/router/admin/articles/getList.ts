/*
 * @Author: litfa
 * @Date: 2022-04-10 15:32:47
 * @LastEditTime: 2022-04-10 16:29:22
 * @LastEditors: litfa
 * @Description: 获取文章列表
 * @FilePath: /blog-service/src/router/admin/articles/getList.ts
 * 
 */
import query from './../../../db/query'
import { Router } from 'express'
const router = Router()

router.post('/all', async (req, res) => {
  const sql = `
  SELECT
      articles.id,
      articles.type,
      articles.uuid,
      articles.title,
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
  GROUP BY articles.id
  ORDER BY articles.createDate DESC
  LIMIT ?, ?
  `
  const { limit = 100, offset = 0 } = req.body
  const [err, results] = await query(sql, [offset, limit])
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, list: results })
})
router.post('/user', async (req, res) => {
  const sql = `
  SELECT
      articles.id,
      articles.type,
      articles.uuid,
      articles.title,
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
  WHERE articles.author=?
  GROUP BY articles.id
  ORDER BY articles.createDate DESC
  LIMIT ?, ?
`
  const { limit = 30, offset = 0, author } = req.body || req.query
  if (!author) return res.send({ status: 4 })
  const [err, results] = await query(sql, [author, offset, limit])

  if (err) return res.send({ status: 5 })
  res.send({ status: 1, list: results })
})
router.post('/status', async (req, res) => {
  const sql = `
  SELECT
      articles.id,
      articles.type,
      articles.uuid,
      articles.title,
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
  WHERE articles.status=?
  GROUP BY articles.id
  ORDER BY articles.createDate DESC
  LIMIT ?, ?
`
  const { limit = 30, offset = 0, status } = req.body || req.query
  if (!status) return res.send({ status: 4 })
  const [err, results] = await query(sql, [status, offset, limit])

  if (err) return res.send({ status: 5 })
  res.send({ status: 1, list: results })
})

export default router