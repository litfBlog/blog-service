/*
* @Author: litfa
* @Date: 2022-03-01 10:52:48
 * @LastEditTime: 2022-03-06 20:35:14
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
    console.log(err, results)
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
router.post('/queryLoginStatus', (req, res) => {
  const { code } = req.body
  if (!code) return res.send({ status: 4 })
  db.query('select * from loginQueue where code=?', code, async (err, results) => {
    // 查询不到
    if (results.length != 1) return res.send({ status: 1, loginStatus: 6 })
    // 超时
    if (results[0].date + config.loginTimeout < Date.now()) {
      return res.send({ staus: 1, loginStatus: 4 })
    }
    res.send({ status: 1, loginStatus: results[0]?.status })
  })
})

import WXBizDataCrypt from '../../utils/wx/WXBizDataCrypt'
import code2Session from './../../utils/wx/code2Session'
import jwt from 'jsonwebtoken'

/**
 * @description: 登录
 */
router.post('/login', async (req, res) => {
  // 获取&处理参数
  const { code, encryptedData, signature, iv } = req.body
  let { scene } = req.body
  scene = scene.toString()

  // 解析用户信息
  const { session_key: sessionKey, openid, unionid } = await code2Session(code)
  const pc = new WXBizDataCrypt(config.wx.appid, sessionKey)
  const data = pc.decryptData(encryptedData, iv)
  console.log({
    openid,
    unionid,
    username: data.nickName,
    avatar: data.avatarUrl,
    registerDate: Date.now()
  })

  // 部分场景值下还可以获取来源应用、公众号或小程序的appId。
  // https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html
  if (scene.length == 4) {
    // 非网页登录
    // 检查是否注册
    // 直接返回token
  } else {
    console.log(scene)
    const status = await loginQueue.queryStatus(scene)
    console.log(status)

    if (status == -1) return res.send({ status: 6 })
  }

  // 查找是否有该用户
  const { results: user } = await query('select * from users where unionid=?', unionid)
  // 找到该用户
  if (user?.length == 1) {
    // 小程序登录 不需要数据库操作 直接登录
    if (scene.length == 4) {
      return res.send({ status: 1, type: 'login' })
    }
    // 网页登录 更新登录队列
    const status = await loginQueue.setStatus(scene, 2, user[0].id)
    if (status == -1) return res.send({ status: 5 })
    return res.send({ status: 1, type: 'login' })
  }

  // 若首次登录 自动注册
  const { err, results } = await query('insert into users set ?', {
    openid,
    unionid,
    username: data.nickName,
    avatar: data.avatarUrl,
    registerDate: Date.now()
  })
  // SQL 语句执行成功，但影响行数不为 1
  if (err || results?.affectedRows !== 1) {
    return res.send({ status: 5, message: '登录失败，请稍后再试！' })
  }
  // 注册成功
  // 小程序登录 不需要数据库操作 直接登录
  if (scene.length == 4) {
    return res.send({ status: 1, type: 'register' })
  }
  // 网页登录 更新登录队列
  const status = await loginQueue.setStatus(scene, 2, results[0].id)
  if (status == -1) return res.send({ status: 5 })
  res.send({ status: 1, message: '注册成功！', type: 'register' })

})

export default router