/*
 * @Author: litfa
 * @Date: 2022-04-10 15:33:17
 * @LastEditTime: 2022-04-10 15:47:38
 * @LastEditors: litfa
 * @Description: 路由
 * @FilePath: /blog-service/src/router/admin/index.ts
 * 
 */
import config from './../../config'
import { Router } from 'express'
const router = Router()
console.log('aaa')

router.get('/', (req, res) => {
  res.send('Admin Status: Ok.')
})

export default router