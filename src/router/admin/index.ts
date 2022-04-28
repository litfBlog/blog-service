/*
 * @Author: litfa
 * @Date: 2022-04-10 15:33:17
 * @LastEditTime: 2022-04-27 17:57:30
 * @LastEditors: litfa
 * @Description: 路由
 * @FilePath: /blog-service/src/router/admin/index.ts
 * 
 */
import { logger } from '../../utils/log'
import { Router } from 'express'
import query from './../../db/query'
const router = Router()

// 用户权限验证
router.use('*', async (req, res, next) => {
  const user = req.user as any
  let err, results
  if (user.id != undefined) {
    [err, results] = await query('SELECT * FROM `users` WHERE id=?', user.id)
    if (err) res.send({ status: 5 })
    if (results.length != 1) return res.send({ status: 5 })
  }
  if (results[0].status != 1) {
    logger.info(`ip:${req.ip}  请求后台:${req.path}  user-agent:${req.headers['user-agent']}`, `${user.id} 账号异常`, JSON.stringify(req.body))
    return res.send({ status: 3 })
  }
  if (results[0].permissions < 15) {
    logger.info(`ip:${req.ip}  请求后台:${req.path}  user-agent:${req.headers['user-agent']}`, `${user.id} 权限不足`, JSON.stringify(req.body))
    return res.send({ status: 2 })
  }
  logger.info(`ip:${req.ip}  请求后台:${req.path}  user-agent:${req.headers['user-agent']}`, `${user.id} 权限通过`, JSON.stringify(req.body))
  next()
})

router.get('/', (req, res) => {
  res.send({ status: 1 })
})

import getList from './articles/getList'
import details from './articles/details'
import getUsers from './users/getUsers'
router.use('/getList', getList)
router.use('/details', details)
router.use('/getUsers', getUsers)

// 审核相关
import friend from './audit/friend'
import articles from './audit/articles'
import report from './audit/report'
router.use('/audit/friend', friend)
router.use('/audit/articles', articles)
router.use('/audit/report', report)

export default router