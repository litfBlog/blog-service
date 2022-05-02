/*
* @Author: litfa
* @Date: 2022-03-01 10:52:48
 * @LastEditTime: 2022-05-02 20:06:05
 * @LastEditors: litfa
 * @Description: 登录相关api
 * @FilePath: /blog-service/src/router/user/login.ts
* 
*/
import config from './../../config'
import express from 'express'
import getUnlimited from './../../utils/wx/getUnlimited'
import db from './../../db/index'
import query from './../../db/query'
import * as loginQueue from './../../utils/sql/loginQueue'
import jwt from './../../utils/token'
import { logger } from '../../utils/log'
const router = express.Router()

/**
 * @description: 获取code
 */
router.post('/getCode', async (req, res) => {
  // 获取随机code
  const code = Date.now().toString() + Math.floor(Math.random() * 5000000000).toString()
  // 插入code
  await db.query('insert into loginQueue set ?', { code, status: 0, date: Date.now() }, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.send({ status: 5, message: err.message })
    res.send({ status: 1, code })
  })
})

/**
 * @description: 获取小程序码
 */
router.post('/getQRCode', async (req, res) => {
  const { code } = req.body

  if (!code) return res.send({ status: 4 })

  await db.query('select * from loginQueue where code=?', code, async (err, results) => {
    // 查询不到
    if (results.length != 1) return res.send({ status: 6 })
    // 超时
    if (results[0].date + config.loginTimeout < Date.now()) {
      return res.send({ staus: 1, loginStatus: 4 })
    }
    // 获取图片
    const img = await getUnlimited(code)

    res.type('image/jpeg')
    res.send(img)
  })
})

/**
 * @description: 获取登录状态
 */
router.post('/queryLoginStatus', async (req, res) => {
  const { code } = req.body
  if (!code) return res.send({ status: 4 })
  // let err, results
  const [err, results] = await query('select * from loginQueue where code=?', code)
  // 查询不到
  if (results.length != 1) return res.send({ status: 1, loginStatus: 6 })
  // 超时
  if (results[0].date + config.loginTimeout < Date.now()) {
    return res.send({ staus: 1, loginStatus: 4 })
  }
  // 查询到id，且登录成功 生成token
  if (results[0].status == 2) {
    let token = ''
    const [err, user] = await query('select * from users where id=?', results[0].userId)
    token = jwt({ ...user[0] })
    return res.send({ status: 1, loginStatus: results[0]?.status, token })
  }
  res.send({ status: 1, loginStatus: results[0]?.status })
})

import WXBizDataCrypt from '../../utils/wx/WXBizDataCrypt'
import code2Session from './../../utils/wx/code2Session'

/**
 * @description: 登录(由小程序调用)
 */
router.post('/login', async (req, res) => {
  // 获取&处理参数
  const { code, encryptedData, signature, iv } = req.body
  let { scene } = req.body
  scene = scene.toString()

  // 无效参数
  if (!encryptedData || !iv || !code) return res.send({ status: 4 })

  // 解析用户信息
  let data
  const { session_key: sessionKey, openid, unionid } = await code2Session(code)
  try {
    const pc = new WXBizDataCrypt(config.wx.appid, sessionKey)
    data = pc.decryptData(encryptedData, iv)
  } catch (e) {
    return res.send({ status: 4 })
  }

  // 部分场景值下还可以获取来源应用、公众号或小程序的appId。
  // https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html
  if (scene.length == 4) {
    // 非网页登录
    // 检查是否注册
    // 直接返回token
  } else {
    // 从数据库查询是否申请过code
    const status = await loginQueue.queryStatus(scene)

    if (status == -1) return res.send({ status: 6 })
  }

  // 查找是否有该用户
  let err, results
  [err, results] = await query('select * from users where unionid=?', unionid)
  // 找到该用户
  if (results?.length == 1) {
    // 小程序登录 不需要数据库操作 直接登录
    const token = jwt({ ...results[0] })
    if (scene.length == 4) {
      logger.info(`ip:${req.ip}  请求:${req.path}  user-agent:${req.headers['user-agent']}`, `${results[0].id}小程序登录成功`)
      return res.send({ status: 1, type: 'login', token })
    }
    // 网页登录 更新登录队列
    const status = await loginQueue.setStatus(scene, 2, results[0].id)
    if (status == -1) return res.send({ status: 5 })
    logger.info(`ip:${req.ip}  请求:${req.path}  user-agent:${req.headers['user-agent']}`, `${results[0].id}小程序+网页登录成功`)
    return res.send({ status: 1, type: 'login', token })
  }

  // 若首次登录 自动注册
  [err, results] = await query('insert into users set ?', {
    openid,
    unionid,
    username: data.nickName,
    avatar: data.avatarUrl,
    registerDate: Date.now()
  })
  // SQL 语句执行成功，但影响行数不为 1
  if (err || results?.affectedRows !== 1) {
    logger.info(`ip:${req.ip}  请求:${req.path}  user-agent:${req.headers['user-agent']}`, '登录失败')
    return res.send({ status: 5, message: '登录失败，请稍后再试！' })
  }
  // 注册成功
  const token = jwt({
    id: results.insertId,
    openid,
    unionid,
    username: data.nickName,
    avatar: data.avatarUrl,
    registerDate: Date.now()
  })
  // 小程序登录 不需要数据库操作 直接登录
  if (scene.length == 4) {
    logger.info(`ip:${req.ip}  请求:${req.path}  user-agent:${req.headers['user-agent']}`, `${results.insertId}小程序注册成功`)
    return res.send({ status: 1, type: 'register', token })
  }
  // 网页登录 更新登录队列
  const status = await loginQueue.setStatus(scene, 2, results.insertId)
  if (status == -1) return res.send({ status: 5 })
  logger.info(`ip:${req.ip}  请求:${req.path}  user-agent:${req.headers['user-agent']}`, `${results.insertId}小程序+网页注册成功`)
  res.send({ status: 1, message: '注册成功！', type: 'register', token })

})

export default router