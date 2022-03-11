/*
 * @Author: litfa
 * @Date: 2022-03-01 10:24:38
 * @LastEditTime: 2022-03-09 17:59:31
 * @LastEditors: litfa
 * @Description: 路由
 * @FilePath: /blog-service/src/router/index.ts
 * 
 */
import express from 'express'
const router = express.Router()

// 用户相关
import userLogin from './user/login'
import getUserInfo from './user/getUserInfo'

router.use('/login', userLogin)
router.use('/getUserInfo', getUserInfo)

// 文章相关
import init from './articles/init'
router.use('/articles/init', init)

export default router