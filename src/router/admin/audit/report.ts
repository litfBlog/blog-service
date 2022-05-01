/*
 * @Author: litfa
 * @Date: 2022-04-27 17:39:10
 * @LastEditTime: 2022-04-28 17:35:20
 * @LastEditors: litfa
 * @Description: 处理举报
 * @FilePath: /blog-service/src/router/admin/audit/report.ts
 * 
 */

import query from '../../../db/query'
import { Router } from 'express'
const router = Router()

router.post('/get', async (req, res) => {
  const [err, results] = await query('SELECT * FROM `report` WHERE ?', { status: 0 })
  if (err) return res.send({ status: 5 })
  res.send({ status: 1, data: results })
})

/**
 * 举报处理仅处理举报 不处理被举报内容
 */
router.post('/solve', async (req, res) => {
  const { id, status } = req.body
  const [err, results] = await query('UPDATE `report` SET ? WHERE ?', [{
    status
  }, {
    id
  }])
  if (err) return res.send({ status: 1 })
  res.send({ status: 1 })
})

export default router