/*
 * @Author: litfa
 * @Date: 2022-04-26 18:31:55
 * @LastEditTime: 2022-04-26 19:44:27
 * @LastEditors: litfa
 * @Description: 举报
 * @FilePath: /blog-service/src/router/operation/report.ts
 * 
 */
import query from './../../db/query'
import { Router } from 'express'
const router = Router()

// 举报文章
router.post('/', async (req, res) => {
  const { type, reportId, cause, note } = req.body
  const user = req.user as any

  if (type != 'articles' && type != 'user' && type != 'comment') {
    return res.send({ status: 4 })
  }

  if (reportId === undefined || cause === undefined) {
    return res.send({ status: 4 })
  }

  // 用户是否举报过
  const [selectErr, results] = await query('SELECT * FROM `report` WHERE type=? AND status=? AND originator_id=? AND report_id=?', [type, 0, user.id, reportId])
  if (selectErr) return res.send({ status: 5 })
  // 举报过 直接返回举报完成
  if (results.length >= 1) return res.send({ status: 1 })

  const [insertErr] = await query('INSERT INTO report SET ?', {
    type,
    report_id: reportId,
    cause,
    note,
    originator_id: user.id,
    date: Date.now(),
    user_ip: req.ip,
    user_agent: req.headers['user-agent']
  })

  if (insertErr) return res.send({ status: 5 })
  res.send({ status: 1 })
})

export default router