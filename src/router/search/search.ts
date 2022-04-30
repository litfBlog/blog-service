/*
 * @Author: litfa
 * @Date: 2022-04-30 14:34:11
 * @LastEditTime: 2022-04-30 18:57:13
 * @LastEditors: litfa
 * @Description: 搜索
 * @FilePath: /blog-service/src/router/search/search.ts
 * 
 */
import { Router } from 'express'
import query from './../..//db/query'
const router = Router()

const sql = `
SELECT
    articles.id,
    articles.title,
    articles.cover,
    articles.content,
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
WHERE articles.status=1 AND INSTR(articles.title, ?) OR articles.status=1 AND INSTR(articles.content, ?)
GROUP BY articles.id
ORDER BY articles.create_date DESC
LIMIT ?, ?
`
router.post('/', async (req, res) => {
  const { keyword } = req.body

  if (!keyword) {
    return res.send({ status: 1, data: [] })
  }

  const [err, results] = await query(sql, [keyword, keyword, 0, 100])

  const data = { ...results }

  for (const i in data) {
    const item: string = data[i].content
    const index = item.indexOf(keyword)
    data[i].content = item.slice(index - 10, index + 50)
    console.log(item.slice(index - 10, index + 50))

  }
  res.send({ status: 1, data: data })
})

router.post('/keyWords', async (req, res) => {
  const { keyword } = req.body
  const [err, results] = await query('SELECT title, id FROM `articles` WHERE articles.status=1 AND INSTR(articles.title, ?) OR articles.status=1 AND INSTR(articles.content, ?)', [keyword, keyword])
  res.send({ status: 1, data: results })
})

export default router