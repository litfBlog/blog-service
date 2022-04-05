/*
 * @Author: litfa
 * @Date: 2022-04-05 14:11:15
 * @LastEditTime: 2022-04-05 16:02:00
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
  users.username AS username
FROM 
  \`comment\` AS COMMENT
LEFT JOIN users users ON users.id=user_id 
WHERE 
  articles_id=?
`

/**
 * @description: 获取视频下的评论列表
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

export default router
