/*
 * @Author: litfa
 * @Date: 2022-04-05 14:11:15
 * @LastEditTime: 2022-04-22 15:09:41
 * @LastEditors: litfa
 * @Description: 获取评论列表
 * @FilePath: /blog-service/src/router/operation/getComment.ts
 * 
 */
import { Router } from 'express'
import query from './../..//db/query'
const router = Router()

/**
 * @description: 处理评论数据
 * @param {*} commentList
 * @return {*}
 */
class FormatCommentList {
  // 原数据
  private commentList: any = {}
  // 处理后结果
  private results: any = []
  /**
   * @description: 处理数据
   * @param {*}
   * @return {*} results
   */
  public format() {
    this.commentList.forEach((element: any) => {
      console.log(element)
      // 父级评论 直接push进去
      if (element.father == 0)
        this.results.push({
          ...element,
          children: []
        })
      else
        this.insertChied(element.father, element)
    })
    return this.results
  }
  // 处理子元素（由format函数调用）
  private insertChied(father: number, element: any) {
    for (const i in this.results) {
      const item = this.results[i]
      if (item.id == father) {
        item.children.push({ ...element })
        break
      }
    }
  }
  constructor(commentList: any) {
    this.commentList = commentList
  }
}

const sql = `
SELECT 
  comment.*, 
  users.avatar AS avatar,
  users.username AS username,
  COUNT(DISTINCT comment_like.id) AS likes_count
FROM 
  \`comment\` AS COMMENT
LEFT JOIN users users ON users.id=user_id 
LEFT JOIN comment_likes comment_like ON comment_like.\`comment_id\`=comment.id AND comment_like.like=1
WHERE 
  comment.articles_id=?
GROUP BY comment.id
`

/**
 * @description: 获取文章下的评论列表
 * @param {*} 
 * @param {*} 
 * @param {*} res
 * @return {*}
 */
router.post('/getList', async (req, res) => {
  const { id } = req.body
  if (!id) return res.send({ status: 4 })
  // 获取文章评论
  const [err, results] = await query(sql, id)
  if (err) return res.send({ status: 5 })
  const commentList = new FormatCommentList(results).format()
  res.send({ status: 1, data: commentList })
})

const detailedSql = `
SELECT 
  comment.*, 
  users.avatar AS avatar,
  users.username AS username,
  COUNT(DISTINCT comment_like.id) AS likes_count,
  IF(is_likes.like=1, 1, 0) AS liked
FROM 
  \`comment\` AS COMMENT
LEFT JOIN users users ON users.id=user_id 
LEFT JOIN comment_likes comment_like ON comment_like.\`comment_id\`=comment.id AND comment_like.like=1
LEFT JOIN \`comment_likes\` is_likes ON  is_likes.\`comment_id\`=comment.\`id\` AND is_likes.\`user_id\`=?
WHERE 
  comment.articles_id=?
GROUP BY comment.id
`
router.post('/detailed/getList', async (req, res) => {
  const { id } = req.body
  const user = req.user as any
  if (!id) return res.send({ status: 4 })
  // 获取文章评论
  const [err, results] = await query(detailedSql, [user.id, id])
  if (err) return res.send({ status: 5 })
  const commentList = new FormatCommentList(results).format()
  res.send({ status: 1, data: commentList })
})

router.post('/getCounts', async (req, res) => {
  const { id } = req.body
  if (!id) return res.send({ status: 4 })
  const [err, results] = await query(sql, id)
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, count: results.length })
})

export default router
