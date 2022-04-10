/*
 * @Author: litfa
 * @Date: 2022-04-09 18:21:11
 * @LastEditTime: 2022-04-09 18:25:39
 * @LastEditors: litfa
 * @Description: 友链
 * @FilePath: /blog-service/src/router/operation/friendLink.ts
 * 
 */
import { Router } from 'express'
import query from './../../db/query'
const router = Router()

router.all('/getHomeLink', (req, res) => {
  // query('')
  res.send()
})

export default router