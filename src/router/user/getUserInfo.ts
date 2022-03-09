/*
 * @Author: litfa
 * @Date: 2022-03-08 10:08:50
 * @LastEditTime: 2022-03-08 10:20:19
 * @LastEditors: litfa
 * @Description: 获取用户信息
 * @FilePath: /blog-service/src/router/user/getUserInfo.ts
 * 
 */
import { Router } from 'express'
const router = Router()

router.post('/', (req, res) => {
  console.log(req.user)

  res.send({ status: 1, userInfo: req.user })
})

export default router