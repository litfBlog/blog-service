/*
 * @Author: litfa
 * @Date: 2022-03-01 10:24:38
 * @LastEditTime: 2022-04-23 12:30:21
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

// 重构文章相关接口(v2前缀)
import initV2 from './articles/v2/init'
import saveV2 from './articles/v2/save'
import pushV2 from './articles/v2/push'
import getListV2 from './articles/v2/getList'
import getOneV2 from './articles/v2/getOne'
// import uploadV2 from './articles/v2/upload'
router.use('/v2/articles/init', initV2)
router.use('/v2/articles/save', saveV2)
router.use('/v2/articles/push', pushV2)
router.use('/v2/articles/get', getListV2)
router.use('/v2/articles/getOne', getOneV2)
// router.use('/v2/articles/upload', uploadV2)

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

// 友链
import friendLink from './operation/friendLink'
router.use('/friendLink', friendLink)

export default router