/*
 * @Author: litfa
 * @Date: 2022-03-01 10:24:38
 * @LastEditTime: 2022-04-12 16:34:53
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
import getLiks from './operation/getLikes'

router.use('/login', userLogin)
router.use('/getUserInfo', getUserInfo)

// 文章相关
import init from './articles/init'
import save from './articles/save'
import push from './articles/push'
import getList from './articles/getList'
import getOne from './articles/getOne'
import upload from './articles/upload'
router.use('/articles/init', init)
router.use('/articles/save', save)
router.use('/articles/push', push)
router.use('/articles/get', getList)
router.use('/articles/getOne', getOne)
router.use('/articles/upload', upload)

// 文章相关操作（点赞、评论……）
import like from './operation/like'
import sendComment from './operation/sendComment'
import getComment from './operation/getComment'
import likeComment from './operation/likeComment'
router.use('/articles/like', like)
router.use('/articles/sendComment', sendComment)
router.use('/articles/getComment', getComment)
router.use('/articles/getLiks', getLiks)
router.use('/articles/likeComment', likeComment)

export default router