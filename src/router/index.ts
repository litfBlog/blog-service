/*
 * @Author: litfa
 * @Date: 2022-03-01 10:24:38
 * @LastEditTime: 2022-03-01 11:12:45
 * @LastEditors: litfa
 * @Description: 路由
 * @FilePath: /blog-service/src/router/index.ts
 * 
 */
import express from 'express'
const router = express.Router() 

import userLogin from './user/login'

router.use('/login' , userLogin)

export default router