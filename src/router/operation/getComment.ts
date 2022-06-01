/*
 * @Author: litfa
 * @Date: 2022-04-05 14:11:15
 * @LastEditTime: 2022-04-25 18:41:43
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
select
  comment.*,
  users.avatar as avatar,
  users.username as username,
  count(distinct comment_like.id) as likes_count,
  avatar_pendant.name as avatar_pendant_name,
  avatar_pendant.url as avatar_pendant_url
from
  comment
left join users on users.id=user_id
left join comment_likes comment_like on comment_like.comment_id=comment.id and comment_like.like=1
left join avatar_pendant on users.avatar_pendant = avatar_pendant.id
where
  comment.articles_id=?
group by comment.id
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
select
  comment.*,
  users.avatar as avatar,
  users.username as username,
  count(distinct comment_like.id) as likes_count,
  if(is_likes.like=1, 1, 0) as liked,
  avatar_pendant.name as avatar_pendant_name,
  avatar_pendant.url as avatar_pendant_url
from
  comment
left join users on users.id=user_id
left join comment_likes comment_like on comment_like.comment_id=comment.id and comment_like.like=1
left join comment_likes is_likes on  is_likes.comment_id=comment.id and is_likes.user_id=?
left join avatar_pendant on users.avatar_pendant = avatar_pendant.id
where
  comment.articles_id=?
group by comment.id
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