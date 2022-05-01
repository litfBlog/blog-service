/*
 * @Author: litfa
 * @Date: 2022-03-08 10:08:50
 * @LastEditTime: 2022-04-25 18:39:02
 * @LastEditors: litfa
 * @Description: 获取用户信息
 * @FilePath: /blog-service/src/router/user/getUserInfo.ts
 * 
 */
import { Router } from 'express'
const router = Router()

router.post('/', (req, res) => {
  res.send({ status: 1, userInfo: req.user })
})

export default router