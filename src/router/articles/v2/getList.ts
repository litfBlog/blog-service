/*
 * @Author: litfa
 * @Date: 2022-03-14 20:19:23
 * @LastEditTime: 2022-04-23 12:24:42
 * @LastEditors: litfa
 * @Description: 首页文章
 * @FilePath: /blog-service/src/router/articles/v2/getList.ts
 * 
 */
import query from '../../../db/query'
import { Router } from 'express'
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
GROUP BY articles.id
ORDER BY articles.create_date DESC
LIMIT ?, ?
`

// 首页
router.all('/home', async (req, res) => {
  // 可选参数 : limit : 返回数量 , 默认为 30 offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
  const { limit = 30, offset = 0 } = req.body || req.query
  const [err, results] = await query(sql, [offset, limit])
  console.log(err)

  if (err) return res.send({ status: 5 })
  res.send({ status: 1, list: results })
})

/**
 * ToDo
 * 4-22 => 4-23
 * 文章获取 可能是查询了未知的字段 修改sql语句（在v2修改）
 */

const userSql = `
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
    COUNT(DISTINCT comments.id) AS commont_count,
    is_liked.\`user_id\` AS liked
FROM
    \`articles\` AS articles
LEFT JOIN \`likes\` likes ON articles.id = likes.articles_id AND likes.like=1
LEFT JOIN \`users\` author ON articles.\`author\` = author.\`id\`
LEFT JOIN \`likes\` is_liked ON articles.id = likes.articles_id AND is_liked.\`user_id\` = 1
LEFT JOIN \`comment\` comments ON articles.id = comments.\`articles_id\`
WHERE articles.author=?
GROUP BY articles.id
ORDER BY articles.create_date DESC
LIMIT ?, ?
`
// 个人页
router.all('/user', async (req, res) => {
  const { limit = 30, offset = 0, author } = req.body || req.query
  if (!author) return res.send({ status: 4 })
  const [err, results] = await query(userSql, [author, offset, limit])

  if (err) return res.send({ status: 5 })
  res.send({ status: 1, list: results })
})
export default router